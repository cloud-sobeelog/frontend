import React, { useState, useEffect } from "react";
import { client } from "../../libs/api";
import './Friend.css';
import { ICProfile } from '../../assets';
import styled from "styled-components";

function FriendRequestList() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [myID, setMyID] = useState(user?.userID || '');

  useEffect(() => {
    const fetchFriendRequestList = async () => {
      try {
        // 로그인 한 사용자의 아이디를 가져옴
        const response = await client.get(`/friends/requests/${myID}`);
        const requestList = response.data.data.friends || [];
        console.log(requestList);
        setRequests(requestList);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (myID) {
      fetchFriendRequestList();
    }
  }, [myID]);

  const handleAccept = async (receiverID, senderID) => {
    try {
      console.log("[친구 수락]: " + receiverID + ", " + senderID);
      await client.patch('/friends/requests', { receiverID, senderID });
      // 새로고침
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const handleReject = async (receiverID, senderID) => {
    try {
      console.log("[친구 거절]: " + receiverID + ", " + senderID);
      await client.post('/friends/requests/delete', {
        user1ID: receiverID, 
        user2ID: senderID
      });
      // 새로고침
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  if (!requests || requests.length === 0) {
    // 받은 친구 요청이 없는 경우
    return (
      <div className='grid'>
        <p>받은 친구 요청</p>
        <StyledDiv>친구 요청을 받으면 여기에 표시됩니다.</StyledDiv>
      </div>
    );
  }

  return (
    <div className='grid'>
      <p>받은 친구 요청</p>
      <div>
        {requests.map((request, index) => {
          const { userID, nickname } = request;
          return (
            <RequestList key={index}>
              <ProfileImg>
                <ICProfile />
              </ProfileImg>
              <div>{nickname}</div>
              <ReplyButtons>
                <AcceptButton onClick={() => handleAccept(myID, userID)}>수락</AcceptButton>
                <RejectButton onClick={() => handleReject(myID, userID)}>거절</RejectButton>
              </ReplyButtons>
            </RequestList>
          );
        })}
      </div>
    </div>
  );
}

export default FriendRequestList;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #6F7071;
  margin-top: 3rem;
  margin-bottom: 5rem;
`;

const ReplyButtons = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const AcceptButton = styled.button`
  width: 5.8rem;
  border-radius: 0.625rem;
  margin: 0.5rem;
  padding: 0.5rem;
  float: inline-end;
  background: rgba(44, 84, 228, 0.85);
  border: rgba(44, 84, 228, 0.85);
  color: white;
`;

const RejectButton = styled.button`
  width: 5.8rem;
  border-radius: 0.625rem;
  margin: 0.5rem;
  padding: 0.5rem;
  float: inline-end;
  background: rgba(188, 204, 222, 0.85);
  border: rgba(188, 204, 222, 0.85);
  color: black;
`;

const RequestList = styled.div`
  display: flex;
  align-items: center;
  margin: 1.25rem;
  font-size: 15px;
`;

const ProfileImg = styled.div`
  margin-right: 1.25rem;
  width: 5rem;
  height: 5rem;
  align-items: center;
`;
