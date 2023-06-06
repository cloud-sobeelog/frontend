import React, { useState, useEffect } from "react";
import { client } from "../../libs/api";
import './Friend.css'
import { ICProfile } from '../../assets';
import styled from "styled-components";

function FriendSearchList({results}) {
  const [myID, setMyID] = useState(null);

  useEffect(() => {
    //TODO: 로그인 한 사용자의 아이디를 가져오도록 바꾸기
    setMyID(1);
  }, [myID]);

  const handleSendRequest = async(senderID, receiverID) => {
    try{
      console.log("[친구 요청 전송]: " + senderID + ", " + receiverID);
      await client.post('/friends/requests', {senderID, receiverID});

      window.location.reload();
    }catch(error){
      console.log(error);
    }
  }

  if (results.length !== 0) {
    return (
      <>
      <div className='grid'>
        <div>
          {results.map((user, index) => {
            const {userId, nickname} = user;
            return (
              <RequestList key = {index}>
                <ProfileImg>
                  <ICProfile/>
                </ProfileImg>
                <div> {nickname} </div>
                <RequestComponents>
                  <RequestButton onClick={() => handleSendRequest(myID, userId)}>친구신청</RequestButton>
                </RequestComponents> 
              </RequestList>
            );
          })}
        </div>
      </div>
      </>
    );
  }
  
  return null;
}

export default FriendSearchList;

const RequestButton = styled.button`
  width: 6.5rem;
  border-radius: 0.625rem;
  margin: 0.5rem;
  padding: 0.5rem;
  float: inline-end;
  background: rgba(44, 84, 228, 0.85);
  border: rgba(44, 84, 228, 0.85);
  color: white;
`; 

const RequestComponents = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
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