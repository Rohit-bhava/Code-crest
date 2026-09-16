package com.example.demo.service;

import com.example.demo.dto.TestCaseResult;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.Comparator;
import java.util.concurrent.*;

@Service
public class CodeExecutionService {

    private static final int TIMEOUT_SECONDS = 5;
    private static final java.util.Set<String> SUPPORTED = java.util.Set.of("python", "java", "cpp");

    public static class ExecutionResult {
        public final String stdout;
        public final String stderr;
        public final boolean timedOut;
        public ExecutionResult(String stdout, String stderr, boolean timedOut) {
            this.stdout = stdout; this.stderr = stderr; this.timedOut = timedOut;
        }
    }

    public boolean isSupported(String language) {
        return language != null && SUPPORTED.contains(language.toLowerCase());
    }

    public ExecutionResult execute(String language, String code, String input, int timeLimitMs) {
        Path workDir = null;
        try {
            workDir = Files.createTempDirectory("codecrest_");
            int timeout = Math.max(TIMEOUT_SECONDS, timeLimitMs / 1000 + 2);
            return switch (language.toLowerCase()) {
                case "python" -> runPython(workDir, code, input, timeout);
                case "java"   -> runJava(workDir, code, input, timeout);
                case "cpp"    -> runCpp(workDir, code, input, timeout);
                default -> new ExecutionResult("", "Unsupported language: " + language, false);
            };
        } catch (Exception e) {
            return new ExecutionResult("", "Execution setup error: " + e.getMessage(), false);
        } finally {
            if (workDir != null) deleteDir(workDir);
        }
    }

    private ExecutionResult runPython(Path dir, String code, String input, int timeout) throws Exception {
        Path file = dir.resolve("solution.py");
        Files.writeString(file, code);
        return runProcess(new String[]{"python", file.toString()}, input, dir, timeout);
    }

    private ExecutionResult runJava(Path dir, String code, String input, int timeout) throws Exception {
        // Extract public class name from code, default to Solution
        String className = extractJavaClassName(code);
        Path file = dir.resolve(className + ".java");
        Files.writeString(file, code);

        // Compile
        ExecutionResult compile = runProcess(
            new String[]{"javac", file.toString()}, "", dir, timeout);
        if (!compile.stderr.isBlank()) {
            return new ExecutionResult("", compile.stderr, false);
        }
        // Run
        return runProcess(new String[]{"java", "-cp", dir.toString(), className}, input, dir, timeout);
    }

    private ExecutionResult runCpp(Path dir, String code, String input, int timeout) throws Exception {
        Path src = dir.resolve("solution.cpp");
        Path bin = dir.resolve("solution");
        Files.writeString(src, code);

        // Compile
        ExecutionResult compile = runProcess(
            new String[]{"g++", "-o", bin.toString(), src.toString()}, "", dir, timeout);
        if (!compile.stderr.isBlank()) {
            return new ExecutionResult("", compile.stderr, false);
        }
        // Run
        return runProcess(new String[]{bin.toString()}, input, dir, timeout);
    }

    private ExecutionResult runProcess(String[] cmd, String input, Path workDir, int timeoutSec) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.directory(workDir.toFile());
        pb.redirectErrorStream(false);
        // Block access to env vars containing secrets
        pb.environment().remove("JAVA_OPTS");
        pb.environment().remove("SPRING_DATASOURCE_PASSWORD");
        pb.environment().remove("JWT_SECRET");

        Process process = pb.start();

        // Write stdin
        if (input != null && !input.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }
        } else {
            process.getOutputStream().close();
        }

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<String> stdoutFuture = executor.submit(() -> readStream(process.getInputStream()));
        Future<String> stderrFuture = executor.submit(() -> readStream(process.getErrorStream()));

        boolean finished = process.waitFor(timeoutSec, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            executor.shutdownNow();
            return new ExecutionResult("", "Time Limit Exceeded", true);
        }

        String stdout = stdoutFuture.get(2, TimeUnit.SECONDS);
        String stderr = stderrFuture.get(2, TimeUnit.SECONDS);
        executor.shutdown();
        return new ExecutionResult(stdout.trim(), stderr.trim(), false);
    }

    private String readStream(InputStream is) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            int lines = 0;
            while ((line = reader.readLine()) != null && lines < 1000) {
                sb.append(line).append("\n");
                lines++;
            }
            return sb.toString();
        } catch (IOException e) {
            return "";
        }
    }

    private String extractJavaClassName(String code) {
        java.util.regex.Matcher m = java.util.regex.Pattern
            .compile("public\\s+class\\s+(\\w+)").matcher(code);
        return m.find() ? m.group(1) : "Solution";
    }

    public String normalizeOutput(String output) {
        if (output == null) return "";
        return output.trim().replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n");
    }

    public TestCaseResult buildResult(int num, String input, String expected,
                                      String actual, String error, boolean hidden) {
        TestCaseResult r = new TestCaseResult();
        r.setTestCaseNumber(num);
        r.setInput(hidden ? "[hidden]" : input);
        r.setExpectedOutput(hidden ? "[hidden]" : expected);
        r.setActualOutput(actual);
        r.setError(error);
        boolean passed = error == null && normalizeOutput(actual).equals(normalizeOutput(expected));
        r.setStatus(passed ? "PASSED" : "FAILED");
        return r;
    }

    private void deleteDir(Path dir) {
        try {
            Files.walk(dir).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
        } catch (IOException ignored) {}
    }
}
