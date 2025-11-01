import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Home.scss";
import {
  getItemComments,
  postItemComment,
  markItemAsReturned,
} from "../../helpers/fakebackend_helper";

import {API_URL} from '../../helpers/url_helper'
const ItemDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item; // item data passed from Home
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [returning, setReturning] = useState(false);

  // 🟩 Fetch comments for this item
  const fetchComments = async () => {
    if (!item?._id) return;
    setLoading(true);
    try {
      const response = await getItemComments(item._id);
      const resData = response?.data || response;

      if (resData.status === 200 && Array.isArray(resData.data)) {
        setComments(resData.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Comments fetch error:", err);
      Swal.fire("Error", "Failed to load comments.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      Swal.fire("Empty Comment", "Please write something before posting.", "warning");
      return;
    }

    if (!item?._id) return;

    setPosting(true);
    try {
      const response = await postItemComment(item._id, { content: newComment });
      const resData = response?.data || response;

      if (resData.status === 200 || resData.success) {
        setNewComment("");
        Swal.fire("✅ Posted", "Your comment has been added!", "success");
        fetchComments(); // refresh comments
      } else {
        Swal.fire("Error", resData.message || "Failed to add comment.", "error");
      }
    } catch (err) {
      console.error("Add Comment Error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong while posting comment.",
        "error"
      );
    } finally {
      setPosting(false);
    }
  };

  // 🟨 Handle Mark as Returned
  const handleMarkAsReturned = async () => {
    if (!item?._id) return;

    const confirm = await Swal.fire({
      title: "Mark Item as Returned?",
      text: "Are you sure you want to mark this item as returned?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as returned",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    setReturning(true);
    try {
      const response = await markItemAsReturned(item._id, {
        title: item.title,
        description: item.description,
      });

      const resData =  response;

      if (resData.status === 200 || resData.success) {
        Swal.fire("✅ Success", "Item marked as returned!", "success");
        navigate("/dashboard"); // redirect after marking
      } else {
        Swal.fire("Error", resData.message || "Failed to mark item as returned.", "error");
      }
    } catch (err) {
      console.error("Return Error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong while marking returned.",
        "error"
      );
    } finally {
      setReturning(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [item]);

  if (!item)
    return (
      <p style={{ padding: "2rem" }}>
        ⚠️ No item data found. Please go back to the home page.
      </p>
    );

    console.log("API_URL",`${API_URL}/${item.image}`)
  return (
    <div className="item-details-container">
      <h1>{item.title}</h1>
      {item.image && (
        <div className="image-div"> 
          <img src= {`${API_URL}${item.image}`} alt={item.title} className="detail-image"  />
          </div>
      )}
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Reported By:</strong> {item.createdBy?.fullName}</p>
      <p><strong>Email:</strong> {item.createdBy?.emailAddress}</p>
      <p><strong>Reported On:</strong> {new Date(item.createdAt).toLocaleString()}</p>

      {!item.returned ? (
        <button
          className="return-btn"
          onClick={handleMarkAsReturned}
          disabled={returning}
        >
          {returning ? "Marking..." : "Mark as Returned ✅"}
        </button>
      ) : (
        <p className="returned-label">✅ This item has been marked as returned.</p>
      )}

      <hr />
      <h2>Comments</h2>

      {/* 🔵 Add Comment Form */}
      <form className="comment-form" onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
        <button type="submit" disabled={posting}>
          {posting ? "Posting..." : "Add Comment"}
        </button>
      </form>

      {/* 🟨 Comments List */}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-box">
              <p>{c.content}</p>
              <small>By: {c.userId?.fullName || "Anonymous"}</small>
              <small style={{ display: "block", color: "#777" }}>
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default ItemDetails;
