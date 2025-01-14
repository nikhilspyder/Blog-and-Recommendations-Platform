package com.backend.elasticsearch.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.backend.elasticsearch.controller.PostController;
import com.backend.elasticsearch.model.Alert;
import com.backend.elasticsearch.model.Post;
import com.backend.elasticsearch.model.SubscribeTopic;
import com.backend.elasticsearch.repository.AlertRepository;
import com.backend.elasticsearch.repository.ApplicationRepository;
import com.backend.elasticsearch.repository.SubscriptionTopicRepository;
import com.backend.elasticsearch.service.PostService;

@Service
public class PostServiceImpl implements PostService{
	
	private static final Logger LOGGER = LogManager.getLogger(PostServiceImpl.class);
	
	@Autowired
	private ApplicationRepository repository;
	
	@Autowired
	private SubscriptionTopicRepository subscriptionTopicRepository;
	
	@Autowired
	private AlertRepository alertRepository;

	@Override
	public Post createPost(Post post) {
		Post resp = repository.save(post);
		
		List<String> userNameList = getSubscribeTopic(post.getTopic());
		
		for(String userName : userNameList) {
			createAlert(userName, resp.getTopic());
		}
		
		return resp;
	}

	@Override
	public Iterable<Post> getPost(String topic) {
		
		if(StringUtils.hasText(topic)) {
			return repository.findPostsByTopic(topic);
		}
		
		return repository.findAll();
	}
	
	@Override
	public Post getPostById(String id) {
		return repository.findById(id).get();
	}

	@Override
	public boolean deletePost(String id) {
		
		try {
		 repository.deleteById(id);
		}catch(Exception e) {
			return false;
		}
		return true;
	}

	@Override
	public Post updatePost(Post post) {
		return repository.save(post);
	}

	@Override
	public boolean subscribeTopic(String userName, String topic) {
		
		try {
			SubscribeTopic subscriptionTopic = subscriptionTopicRepository.findAllByTopic(topic);
			
			List<String> userNameList = new ArrayList<>();
			
			if(Objects.nonNull(subscriptionTopic)) {
				List<String> list = subscriptionTopic.getUserNameList();
				
				if(CollectionUtils.isEmpty(list) || (!CollectionUtils.isEmpty(list) && !list.contains(userName))) {
					userNameList.add(userName);
					userNameList.addAll(list);
				}
				
				subscriptionTopic.setUserNameList(userNameList);
				
				SubscribeTopic resp = subscriptionTopicRepository.save(subscriptionTopic);
				LOGGER.info(resp);
				return true;
				
			}else {
				subscriptionTopic = new SubscribeTopic();
				subscriptionTopic.setTopic(topic);
				userNameList.add(userName);
				subscriptionTopic.setUserNameList(userNameList);
				SubscribeTopic resp = subscriptionTopicRepository.save(subscriptionTopic);
				LOGGER.info(resp);
				return true;
			}
		}catch(Exception e) {
			e.printStackTrace();
			return false;			
		}
		
	}
	
	@Override
	public List<String> getSubscribeTopic(String topic) {
		
		SubscribeTopic subscriptionTopic = subscriptionTopicRepository.findAllByTopic(topic);
		
		if(Objects.nonNull(subscriptionTopic)) {
			return subscriptionTopic.getUserNameList();
		}
		return new ArrayList<>();
	}

	@Override
	public boolean unsubscribeTopic(String userName, String topic) {
		try {
			SubscribeTopic subscriptionTopic = subscriptionTopicRepository.findAllByTopic(topic);
			
			if(Objects.nonNull(subscriptionTopic)) {
				List<String> list = subscriptionTopic.getUserNameList();
				
				LOGGER.info("list - " +list);
				
				if(!CollectionUtils.isEmpty(list)) {
					list.remove(userName);
				}
				
				subscriptionTopic.setUserNameList(list);
				
				SubscribeTopic resp = subscriptionTopicRepository.save(subscriptionTopic);
				LOGGER.info(resp);
			}
		}catch(Exception e) {
			e.printStackTrace();
			return false;			
		}
		return true;
	}
	
	@Override
	public List<String> getAlert(String userName) {
		
		Alert alert = alertRepository.findAllByUserName(userName);
		
		if(Objects.nonNull(alert)) {
			return alert.getAlertList();
		}
		return new ArrayList<>();
	}

	@Override
	public boolean createAlert(String userName,String topic) {
		
		LOGGER.info("createAlert - " + userName + " - " + topic);
		
		try {
			Alert alert = alertRepository.findAllByUserName(userName);
			
			List<String> topicList = new ArrayList<>();
			
			if(Objects.nonNull(alert)) {
				List<String> list = alert.getAlertList();
				
				if(CollectionUtils.isEmpty(list) || (!CollectionUtils.isEmpty(list) && !list.contains(userName))) {
					topicList.add(topic);
					topicList.addAll(list);
				}
				
				alert.setAlertList(topicList);
				
				Alert resp = alertRepository.save(alert);
				LOGGER.info(resp);
				return true;
				
			}else {
				alert = new Alert();
				alert.setUserName(userName);
				topicList.add(topic);
				alert.setAlertList(topicList);
				Alert resp = alertRepository.save(alert);
				LOGGER.info(resp);
				return true;
			}
		}catch(Exception e) {
			e.printStackTrace();
			return false;			
		}
	}

	@Override
	public boolean deleteAlert(String userName,String topic) {
		
		try {
			Alert alert = alertRepository.findAllByUserName(userName);
			
			if(Objects.nonNull(alert)) {
				List<String> list = alert.getAlertList();
				
				LOGGER.info("list - " +list);
				
				if(!CollectionUtils.isEmpty(list)) {
					list.remove(topic);
				}
				
				alert.setAlertList(list);
				
				if(CollectionUtils.isEmpty(list)) {
					alertRepository.deleteById(alert.getId());
				}else {					
					Alert resp = alertRepository.save(alert);
					LOGGER.info(resp);
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
			return false;			
		}
		return true;
	}
}
