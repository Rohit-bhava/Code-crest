import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { fetchChallengeById, runSolution, submitSolution, clearResults } from '../store/slices/challengeSlice';
import { toast } from 'react-toastify';

const LANGUAGES = [
  { value: 'python', label: 'Python 3' },
  { value: 'java',   label: 'Java' },
  { value: 'cpp',    label: 'C++' },
];

const STARTERS = {
  python: `# Python 3
import sys
input = sys.stdin.readline

def solve():
    # Write your solution here
    pass

solve()
`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Write your solution here
    return 0;
}
`,
};

const diffBadge = (d) => {
  const map = { EASY: 'badge-easy', MEDIUM: 'badge-medium', HARD: 'badge-hard' };
  return `badge ${map[d] || 'badge-easy'}`;
};

const verdictStyle = (v) => {
  if (v === 'ACCEPTED') return { color: '#065f46', background: '#d1fae5' };
  if (v === 'WRONG_ANSWER') return { color: '#991b1b', background: '#fee2e2' };
  if (v === 'COMPILATION_ERROR') return { color: '#92400e', background: '#fef3c7' };
  if (v === 'TIME_LIMIT_EXCEEDED') return { color: '#1e40af', background: '#dbeafe' };
  return { color: '#5b21b6', background: '#ede9fe' };
};

export default function ChallengeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: challenge, loading, error, runResult, submitResult, running, submitting } = useSelector((s) => s.challenges);
  const { user } = useSelector((s) => s.auth);
  const canCode = !!user; // any logged-in user can run/submit

  const [lang, setLang] = useState('python');
  const [code, setCode] = useState(STARTERS['python']);
  const [activeTab, setActiveTab] = useState('problem');
  const [visibleTestCases, setVisibleTestCases] = useState([]);

  useEffect(() => {
    dispatch(fetchChallengeById(id));
    // Fetch visible test cases to display in problem panel
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`http://localhost:8080/api/challenges/${id}/testcases`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setVisibleTestCases(data); })
      .catch(() => {});
    return () => dispatch(clearResults());
  }, [id, dispatch]);

  const handleLangChange = useCallback((e) => {
    const l = e.target.value;
    setLang(l);
    setCode(STARTERS[l]);
  }, []);

  const handleRun = async () => {
    if (!code.trim()) { toast.error('Code cannot be empty'); return; }
    const res = await dispatch(runSolution({ id: Number(id), data: { language: lang, code } }));
    if (res.meta.requestStatus === 'rejected') toast.error(res.payload || 'Run failed');
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Code cannot be empty'); return; }
    const res = await dispatch(submitSolution({ id: Number(id), data: { language: lang, code } }));
    if (res.meta.requestStatus === 'fulfilled') {
      const v = res.payload.status;
      if (v === 'ACCEPTED') toast.success('✅ Accepted! All test cases passed!');
      else toast.error(`❌ ${v.replace(/_/g, ' ')}`);
    } else {
      toast.error(res.payload || 'Submission failed');
    }
  };

  const handleReset = () => setCode(STARTERS[lang]);

  if (loading && !challenge) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!challenge) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ background: '#1e1b4b', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #312e81' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/challenges')}>← Back</button>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', flex: 1 }}>{challenge.title}</span>
        <span className={diffBadge(challenge.difficulty)}>{challenge.difficulty}</span>
        <span style={{ color: '#a78bfa', fontSize: '0.85rem' }}>🏆 {challenge.basePoints} pts</span>
        {challenge.timeLimitMs && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>⏱ {challenge.timeLimitMs}ms</span>}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setActiveTab('problem')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeTab === 'problem' ? '#6c47ff' : '#312e81', color: '#fff', fontSize: '0.82rem' }}>Problem</button>
          <button onClick={() => setActiveTab('editor')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeTab === 'editor' ? '#6c47ff' : '#312e81', color: '#fff', fontSize: '0.82rem' }}>Editor</button>
        </div>
      </div>

      {/* Main split layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT — Problem Panel */}
        <div style={{
          width: '40%', minWidth: 320, overflowY: 'auto', background: '#fff',
          borderRight: '1px solid #e2e8f0', padding: '20px 24px',
          display: activeTab === 'editor' ? 'none' : 'block',
        }}
          className="problem-panel"
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '1.2rem', color: '#1e293b' }}>{challenge.title}</h2>

          <Section title="Problem Description">
            <p style={{ whiteSpace: 'pre-wrap', color: '#334155', lineHeight: 1.7 }}>{challenge.description}</p>
          </Section>

          {challenge.inputFormat && (
            <Section title="Input Format">
              <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{challenge.inputFormat}</p>
            </Section>
          )}

          {challenge.outputFormat && (
            <Section title="Output Format">
              <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{challenge.outputFormat}</p>
            </Section>
          )}

          {challenge.constraints && (
            <Section title="Constraints">
              <pre style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: '0.88rem', color: '#475569', margin: 0 }}>{challenge.constraints}</pre>
            </Section>
          )}

          {challenge.sampleInput && (
            <Section title="Sample Input">
              <pre style={codeBlock}>{challenge.sampleInput}</pre>
            </Section>
          )}

          {challenge.sampleOutput && (
            <Section title="Sample Output">
              <pre style={codeBlock}>{challenge.sampleOutput}</pre>
            </Section>
          )}

          {/* Visible Test Cases */}
          {visibleTestCases.length > 0 && (
            <Section title="Sample Test Cases">
              {visibleTestCases.map((tc, i) => (
                <div key={tc.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#6c47ff', marginBottom: 6 }}>Test Case {i + 1}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 4 }}>Input:</div>
                  <pre style={{ ...codeBlock, marginBottom: 8 }}>{tc.input}</pre>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 4 }}>Expected Output:</div>
                  <pre style={codeBlock}>{tc.expectedOutput}</pre>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* RIGHT — Editor + Results Panel */}
        <div style={{
          flex: 1, flexDirection: 'column', overflow: 'hidden', background: '#0f172a',
          display: activeTab === 'problem' ? 'none' : 'flex',
        }}
          className="editor-panel"
        >
          {/* Language selector + action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
            <select value={lang} onChange={handleLangChange} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.88rem' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>↺ Reset</button>
            <div style={{ flex: 1 }} />
            {canCode ? (
              <>
                <button className="btn btn-sm" onClick={handleRun} disabled={running || submitting}
                  style={{ background: '#0ea5e9', color: '#fff', minWidth: 80 }}>
                  {running ? '⏳ Running...' : '▶ Run'}
                </button>
                <button className="btn btn-sm" onClick={handleSubmit} disabled={running || submitting}
                  style={{ background: '#10b981', color: '#fff', minWidth: 90 }}>
                  {submitting ? '⏳ Submitting...' : '🚀 Submit'}
                </button>
              </>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Login to run/submit</span>
            )}
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={lang === 'cpp' ? 'cpp' : lang}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Results Panel */}
          {(runResult || submitResult) && (
            <div style={{ maxHeight: 300, overflowY: 'auto', background: '#1e293b', borderTop: '1px solid #334155', padding: '12px 16px' }}>

              {/* Submit Result Banner */}
              {submitResult && (
                <div style={{ ...verdictStyle(submitResult.status), padding: '10px 16px', borderRadius: 8, marginBottom: 12, fontWeight: 700, fontSize: '0.95rem' }}>
                  {submitResult.status.replace(/_/g, ' ')} — {submitResult.message}
                  {submitResult.pointsEarned > 0 && <span style={{ marginLeft: 12 }}>+{submitResult.pointsEarned} pts</span>}
                  <span style={{ marginLeft: 12, fontWeight: 400, fontSize: '0.85rem' }}>{submitResult.passed}/{submitResult.total} passed</span>
                  {submitResult.executionTime != null && <span style={{ marginLeft: 12, fontWeight: 400, fontSize: '0.85rem' }}>⏱ {submitResult.executionTime}ms</span>}
                </div>
              )}

              {/* Run Test Case Results */}
              {runResult && (
                <>
                  {runResult.error && (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: '8px 12px', borderRadius: 6, marginBottom: 10, fontSize: '0.85rem' }}>
                      <strong>Error:</strong>
                      <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', fontSize: '0.82rem' }}>{runResult.error}</pre>
                    </div>
                  )}
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 8 }}>
                    Test Results: <strong style={{ color: '#e2e8f0' }}>{runResult.passed}/{runResult.total} passed</strong>
                  </div>
                  {runResult.testCases?.map((tc) => (
                    <TestCaseCard key={tc.testCaseNumber} tc={tc} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Responsive: show both panels side by side on desktop */}
      <style>{`
        @media (min-width: 900px) {
          .problem-panel { display: block !important; }
          .editor-panel  { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c47ff', marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function TestCaseCard({ tc }) {
  const passed = tc.status === 'PASSED';
  return (
    <div style={{ background: '#0f172a', borderRadius: 8, padding: '10px 14px', marginBottom: 8, border: `1px solid ${passed ? '#065f46' : '#991b1b'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>Test Case {tc.testCaseNumber}</span>
        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: passed ? '#34d399' : '#f87171' }}>
          {passed ? '✓ Passed' : '✗ Failed'}
        </span>
      </div>
      {tc.input !== '[hidden]' && <Row label="Input" value={tc.input} />}
      {tc.expectedOutput !== '[hidden]' && <Row label="Expected" value={tc.expectedOutput} />}
      <Row label="Got" value={tc.actualOutput || '(no output)'} highlight={!passed} />
      {tc.error && <Row label="Error" value={tc.error} highlight />}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: '0.82rem' }}>
      <span style={{ color: '#64748b', minWidth: 60 }}>{label}:</span>
      <pre style={{ margin: 0, color: highlight ? '#f87171' : '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{value}</pre>
    </div>
  );
}

const codeBlock = {
  background: '#f1f5f9', padding: '10px 14px', borderRadius: 8,
  fontSize: '0.88rem', color: '#1e293b', margin: 0, whiteSpace: 'pre-wrap',
  border: '1px solid #e2e8f0',
};
