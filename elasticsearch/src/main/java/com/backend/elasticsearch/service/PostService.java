package com.backend.elasticsearch.service;

import java.util.List;

import com.backend.elasticsearch.model.Post;

public interface PostService {

	public Post createPost(Post post);

	public Iterable<Post> getPost(String topic);

	public boolean deletePost(String id);

	public Post updatePost(Post post);

	public Post getPostById(String id);

	public boolean subscribeTopic(String userName, String topic);

	public List<String> getSubscribeTopic(String userName);

	public boolean unsubscribeTopic(String userName, String topic);

	public boolean deleteAlert(String userName, String post);

	public List<String> getAlert(String userName);

	public boolean createAlert(String userName, String post);

}
