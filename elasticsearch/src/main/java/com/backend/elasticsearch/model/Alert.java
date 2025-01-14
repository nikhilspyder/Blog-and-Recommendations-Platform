package com.backend.elasticsearch.model;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Document;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "alert")
public class Alert {
	
	private String id;
	
	private String userName;
	
	private List<String> alertList;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public List<String> getAlertList() {
		return alertList;
	}

	public void setAlertList(List<String> alertList) {
		this.alertList = alertList;
	}

	@Override
	public String toString() {
		return "Alert [id=" + id + ", userName=" + userName + ", alertList=" + alertList + "]";
	}
	
}
