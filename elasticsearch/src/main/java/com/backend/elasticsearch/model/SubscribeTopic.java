package com.backend.elasticsearch.model;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Document;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "subscribetopicv1")
public class SubscribeTopic {
	
	private String id;
	
	private String topic;
	
	private List<String> userNameList;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public List<String> getUserNameList() {
		return userNameList;
	}

	public void setUserNameList(List<String> userNameList) {
		this.userNameList = userNameList;
	}

	@Override
	public String toString() {
		return "SubscribeTopic [id=" + id + ", topic=" + topic + ", userNameList=" + userNameList + "]";
	}

}
