import React,{useEffect, useState} from 'react';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { client } from '../libs/api';
import Header from '../components/common/Header';
import Navigator from '../components/common/Navigator';
import {ICProfile, ICGoodEmoticon, ICBadEmoticon} from '../assets';

import Tag from '../components/common/TagDesign';
import CommentInput from '../components/comment/CommentInput';

function ConsumptionDetail(){
    const {search} = useLocation();
    const cHistoryID = queryString.parse(search).id;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [status, setStatus] = useState(parseInt(10));
    const [consumptionDetail, setConsumptionDetail] = useState();
    const [comment, setComment] = useState();
    const [emoticonCount, setEmoticonCount] = useState({
        positiveEmoticonCount: 0,
        negativeEmoticonCount: 0
    });
    const [replyActive, setReplyActive] = useState(false);
    const [replyCommentInfo, setReplyCommentInfo] = useState([]);
    const navigate = useNavigate();


    const getConsumptionDetailData = async () => {
        const {data} = await client.get(`/consumptions/${cHistoryID}`);
        const userData = await client.get(`/user/userInfo/${data.data.userID}`);
        
        const consumptionDetail = {
            nickname: userData.data.data[0].nickname,
            ...data.data,
        }
        data.data && setConsumptionDetail(consumptionDetail);
        console.log(userData.data.data[0].nickname);
        console.log(consumptionDetail);
    }
    
    const getCommentData = async() => {
        const {data} = await client.get(`/comment/${cHistoryID}`);
        data.data && setComment(data.data);
    }

    const getEmoticonData = async() => {
        const {data} = await client.get(`/emoticon/${cHistoryID}/user/${user.userID}`);
        console.log(data);
        setStatus(data.data[0].category);
    }

    const getEmoticonCountData = async() => {
        const positiveData = await client.get(`/emoticon/${cHistoryID}/0`);
        const positiveEmoticonCount = positiveData.data.data;

        const negativeData = await client.get(`/emoticon/${cHistoryID}/1`);
        const negativeEmoticonCount = negativeData.data.data;
        
        setEmoticonCount({
            positiveEmoticonCount: positiveEmoticonCount,
            negativeEmoticonCount: negativeEmoticonCount,
        })
    }

    useEffect(() => {
        getConsumptionDetailData();
        getCommentData();
        getEmoticonData();
        getEmoticonCountData();
    },[]);
    
    const onClickHandler = async(category) => {
        const postData = {
            userID: user.userID,
            category: category
        }
        const {data} = await client.post(`/emoticon/${cHistoryID}`,postData);
        window.location.reload();
    }

    return(
        <StyledConsumptionDetail>
            <Header/>
            <StyledDetail>
                <StyledProfile>
                    <ICProfile/>
                    <div>{consumptionDetail && consumptionDetail.nickname}</div>
                </StyledProfile>
                <StyledLine/>
                <StyledBody>
                    <StyledContent>
                        {consumptionDetail && consumptionDetail.content}
                    </StyledContent>
                    <StyledAmount>
                        -{consumptionDetail && consumptionDetail.amount}원
                    </StyledAmount>
                </StyledBody>
                <StyledDate>
                    {consumptionDetail && consumptionDetail.date.replaceAll('-','.')}
                </StyledDate>

                <StyledTag>
                    {
                        (typeof(consumptionDetail && consumptionDetail.category)=='string') ? 
                            <Tag content={consumptionDetail && consumptionDetail.category}/> 
                            : 
                            consumptionDetail &&consumptionDetail.category.map((element)=> <Tag content={element}/>)
                    }
                </StyledTag>
                <StyledLightLine/>

                <StyledEmoticon>
                    <StyledGoodEmoticon>
                        <p>{emoticonCount && emoticonCount.positiveEmoticonCount}</p>
                        <p>칭찬해요</p>
                        {(parseInt(status)===10) ? <ICGoodEmoticon width="25" height="25" stroke="white" fillOpacity={0.3} onClick={()=>onClickHandler(0)}/> :
                            (parseInt(status)===0) ? <ICGoodEmoticon width="25" height="25" stroke="white" stroke-width="0.6" strokeOpacity={1} fillOpacity={1} onClick={()=>onClickHandler(0)}/>: 
                                    <ICGoodEmoticon width="25" height="25" stroke="white" stroke-width="0.6" fillOpacity={0.3} onClick={()=>onClickHandler(0)}/>}
                    </StyledGoodEmoticon>
                    <StyledBadEmoticon>
                        {(parseInt(status)===10) ? <ICBadEmoticon width="25" height="25" stroke="white" fillOpacity={0.3} onClick={()=>onClickHandler(1)}/> :
                            (parseInt(status)===0) ? <ICBadEmoticon width="25" height="25" stroke="white" fillOpacity={0.3} onClick={()=>onClickHandler(1)}/> :
                                <ICBadEmoticon width="25" height="25" stroke="white" stroke-width="0.6" strokeOpacity={1} fillOpacity={1} onClick={()=>onClickHandler(1)}/>}
                        <p>아쉬워요</p>
                        <p>{emoticonCount && emoticonCount.negativeEmoticonCount}</p>
                    </StyledBadEmoticon>
                </StyledEmoticon>
                <StyledLightLine/>

                <StyledCommentArea>
                    {comment && comment.map((element)=>{
                                return (
                                    (element.replyID==null) ? <StyledComment>
                                        <StyledCommentContent>
                                            <ICProfile width="31" height="32"/>
                                            <p>{element.content}</p>
                                        </StyledCommentContent>
                                        <StyledReplyButton onClick={()=>{
                                            setReplyActive(true)
                                            setReplyCommentInfo(element)}
                                        }>
                                            답글달기
                                        </StyledReplyButton>
                                        {comment.map(replyElement => {
                                            return(
                                                (replyElement.replyID===element.commentID) ? <StyledReply>
                                                    <ICProfile width="31" height="32"/>
                                                    <p>{replyElement.content}</p>
                                                </StyledReply> : null
                                            )})}
                                    </StyledComment> : null
                                )
                    })} 
                </StyledCommentArea>
                <StyledCommentInput>
                    <CommentInput cHistoryID={cHistoryID} replyActive={replyActive} replyCommentInfo={replyCommentInfo}/>
                </StyledCommentInput>
            </StyledDetail>
            <Navigator/>
        </StyledConsumptionDetail>
    )
}

export default ConsumptionDetail;

const StyledConsumptionDetail = styled.div`
    overflow-y:scroll;
    height: 80vh;
    margin-top: 8rem;
    margin-bottom: 10rem;
    ::-webkit-scrollbar {
        display: none;
    }
    display:flex;
    justify-content:center;

`

const StyledDetail = styled.div`
    margin: 2rem 2.1rem 1.4rem 2.1rem;
    width: 34.8rem;
    height: 67.7rem;
    border: 0.1rem solid #000000;
    border-radius: 2rem;
    display: flex;
    flex-direction:column;
    padding: 1.8rem 2.5rem 2.5rem 2.5rem;
`

const StyledProfile = styled.div`
    display:flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.8rem;
    height: 3.528rem;
    margin-left: 0.3rem;
    div{
        font-size: 1.2rem;
    }
`

const StyledLine = styled.hr`
    border-top: 0.1rem solid #000000;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    transform: matrix(1, 0, -0.01, 1, 0, 0);
    margin: 1.272rem 0 0 0;
`

const StyledBody = styled.div`
    margin-top: 1.915rem;

    display: flex;
    justify-content: space-between;
    margin-left:0.7rem;
    margin-right: 0.7rem;
`
const StyledContent = styled.div`
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
    color: #000000;
`

const StyledAmount = styled.div`
    font-size: 1.7rem;
    font-weight: 400;
    line-height: 2.1rem;
    color: #000000;
`

const StyledDate = styled.div`
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;

    margin-top: 0.5rem;
    margin-left:0.7rem;
    margin-right: 0.7rem;
    color: ${(props)=>props.theme.colors.mainBlue};
`

const StyledTag = styled.div`
    margin-top: 15.1rem;
    margin-left: 0.7rem;
`

const StyledLightLine = styled.hr`
    border-top: 0.1rem solid rgba(0, 0, 0, 0.3);
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    transform: matrix(1, 0, -0.01, 1, 0, 0);
    margin: 1.3rem 0 0 0;
`

const StyledEmoticon = styled.div`
    margin-top: 1.315rem;
    display: flex;
    gap: 2.6rem;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
`

const StyledGoodEmoticon = styled.div`
    display: flex;
    gap: 1.3rem;
    p{
        font-weight: 400;
        font-size: 1.7rem;
        line-height: 2.1rem;
    }
    align-items: center;
`

const StyledBadEmoticon = styled.div`
    display: flex;
    gap: 1.3rem;
    p{
        font-weight: 400;
        font-size: 1.7rem;
        line-height: 2.1rem;
    }
    align-items: center;

`

const StyledCommentArea = styled.div`
    margin-top: 1.615rem;
    padding: 1.6rem 1.7rem 1.6rem 1.7rem;
    background: rgba(217, 217, 217, 0.3);
    box-shadow: 0rem 0.4rem 0.4rem rgba(0, 0, 0, 0.25);
    border-radius: 1rem;

    width: 29.8rem;
    height: 26rem;
    display:flex;
    flex-direction: column;
    gap: 1.3rem;
    overflow-y:scroll;
    ::-webkit-scrollbar {
        display: none;
    }
`

const StyledComment = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`
const StyledCommentContent = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    p{
        font-weight: 400;
        font-size: 1.5rem;
        line-height: 1.8rem;
        color: #000000;
        opacity: 1;
    }
    z-index:1;
`

const StyledReplyButton = styled.button`
    font-weight: 400;
    font-size: 0.8rem;
    line-height: 1rem;
    color: #000000;
    opacity: 0.5;
    display: flex;
    justify-content: flex-start;
    margin-left: 3.5rem;
`

const StyledCommentInput = styled.div`
    
`

const StyledReply = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-left: 3rem;
    margin-top: 1rem;
    p{
        font-weight: 400;
        font-size: 1.5rem;
        line-height: 1.8rem;
        color: #000000;
        opacity: 1;
    }
    z-index:1;
`