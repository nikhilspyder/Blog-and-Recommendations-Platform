package com.backend.elasticsearch.model;

import lombok.Data;

public class Reply {
	
	private String id;
	
	private String author;
	
	private String date;

	private String replyContent;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getReplyContent() {
		return replyContent;
	}

	public void setReplyContent(String replyContent) {
		this.replyContent = replyContent;
	}

	@Override
	public String toString() {
		return "Reply [id=" + id + ", author=" + author + ", date=" + date + ", replyContent=" + replyContent + "]";
	}
	
}
