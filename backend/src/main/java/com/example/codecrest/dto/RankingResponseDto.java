package com.example.codecrest.dto;

public class RankingResponseDto {
    private Integer rank;
    private String username;
    private Integer score;

    public RankingResponseDto() {}

    public RankingResponseDto(Integer rank, String username, Integer score) {
        this.rank = rank;
        this.username = username;
        this.score = score;
    }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}