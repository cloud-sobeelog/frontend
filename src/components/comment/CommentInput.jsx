import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ICComment } from '../../assets';
import { client } from '../../libs/api';

function CommentInput({cHistoryID, replyActive, replyCommentInfo}){
    // TODO: 댓글 POST할 때 필요(onClick에 걸어야함)
    // const cHistoryID = chistoryId;
    const [comment, setComment] = useState('');
    const [replyInfo, setReplyInfo] = useState();
    const user = JSON.parse(sessionStorage.getItem("user"));

    console.log(replyCommentInfo);
    const update = () => {
        if(replyActive){
            const str = '@' + replyCommentInfo.nickname;
            setReplyInfo(str);
        }
    }
    const onChange = (e) => {
        setComment(e.target.value);
    }

    const parentCommentClick = async () => {
        const postData = {
            userID: user.userID,
            content: JSON.stringify(comment),
            replyID: 0,
        }
        const {data} =  await client.post(`/comment/${cHistoryID}`,{...postData});
        if(data.success){
            window.location.reload();
        }
    }

    const childrenCommentClick = async () => {
        const postData = {
            userID: user.userID,
            content: JSON.stringify(comment),
            replyID: replyCommentInfo.commentID,
        }
        const {data} =  await client.post(`/comment/${cHistoryID}/`,{...postData});
        if(data.success){
            window.location.reload();
        }
    }

    useEffect(()=>{
        update()
    });

    return(
        replyActive ? 
        <StyledReplyCommentInputBox>
            <input placeholder={replyInfo} onChange={onChange} />
            <ICComment onClick={
                childrenCommentClick
            }/>
        </StyledReplyCommentInputBox>
        :
        <StyledCommentInputBox>
            <input placeholder='댓글을 입력하세요' onChange={onChange} />
            <ICComment onClick={
                parentCommentClick
            }/>
        </StyledCommentInputBox>
    )
}

export default CommentInput;

const StyledCommentInputBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.8rem;
    background-color: #FFFFFF;
    box-shadow: 0 0.4rem 0.4rem rgba(0,0,0,0.25);
    border-radius: 2rem;
    border: 1px solid #000000;
    margin-top: 1.19rem;
    padding: 0.7rem 1.3rem 0.7rem 1.3rem;
    gap:0.5rem;
    input { 
        width: 100%;
        border: none;
        border-radius:4px;
        box-shadow: none;
        -webkit-appearance:none;
        -moz-appearance: none;
        -o-appearance:none;
        appearance: none;
        ::placeholder{
            font-size: 1.2rem;
        }
        :focus{
            outline:none;
        }
    }
`


const StyledReplyCommentInputBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.8rem;
    background-color: #FFFFFF;
    box-shadow: 0 0.4rem 0.4rem rgba(0,0,0,0.25);
    border-radius: 2rem;
    border: 1px solid #000000;
    margin-top: 1.19rem;
    padding: 0.7rem 1.3rem 0.7rem 1.3rem;
    gap:0.5rem;
    input { 
        width: 100%;
        border: none;
        border-radius:4px;
        box-shadow: none;
        -webkit-appearance:none;
        -moz-appearance: none;
        -o-appearance:none;
        appearance: none;
        ::placeholder{
            font-size: 1.2rem;
        }
        :focus{
            outline:none;
        }
    }

`