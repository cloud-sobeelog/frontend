import React, { useState } from 'react';
import styled from 'styled-components';
import {ICProfile, ICGoodEmoticon, ICBadEmoticon, ICComment} from '../../assets';
import Tag from '../common/TagDesign';
import CommentArea from '../comment/CommentArea';
import CommentInput from '../comment/CommentInput';

function CalendarConsumption({info, onClick}){
    const [content, setContent] = useState(info);
    console.log(content);
    const commentArray = content.comment ? content.comment.slice(0, 1) : [];
    console.log(commentArray);
    // TODO : userID에 따라서 닉네임 가져오는 과정이 있어야함
    return(
        <StyledCalendarConsumption>
            <StyledHeader>
                <StyledProfile>
                    <ICProfile/>
                    <div>{content.writerNickname}</div>
                </StyledProfile>
                <StyledCountReaction>
                    <StyledPositiveEmoticon>
                        <ICGoodEmoticon/>
                        <p>{content.positiveEmoticonCount}</p>
                    </StyledPositiveEmoticon>
                    <StyledNegativeEmoticon>
                        <ICBadEmoticon/>
                        <p>{content.negativeEmoticonCount}</p>
                    </StyledNegativeEmoticon>
                    <StyledCommentEmoticon>
                        <ICComment/>
                        <p>{content.commentCount}</p>
                    </StyledCommentEmoticon>
                </StyledCountReaction>
            </StyledHeader>
            
            <StyledLine/>

            <StyledBody onClick={onClick}>
                <StyledContent>
                    {content.content}
                </StyledContent>
                <StyledAmount>
                    -{content.amount}원
                </StyledAmount>
            </StyledBody>
            {
                (typeof(content.category)=='string') ? <Tag content={content.category}/> : content.category.map((element)=> <Tag content={element}/>)
            }

            {(commentArray.length >= 1) ? <StyledCommentArea>
                    {content.comment && commentArray.map((element)=>{
                            console.log("여기",element);
                            return <CommentArea comment={element}/>
                    })} 
            </StyledCommentArea> : <CommentInput cHistoryID={content.cHistoryID}/>}
        </StyledCalendarConsumption>
    )
}

export default CalendarConsumption;

const StyledCalendarConsumption = styled.div`
    border: 0.1rem solid #000000;
    border-radius: 1rem;
    margin-top: 1.9rem;
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    padding: 1.2rem 2.5rem 2.499rem 2.5rem;
`
const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledProfile = styled.div`
    display: flex;
    gap: 1.091rem;
    align-items: center;
    div{
        font-size: 1.2rem;
        line-height: 1.5rem;
    }
`

const StyledCountReaction = styled.div`
    display: flex;
    gap: 0.8rem;
`

const  StyledPositiveEmoticon = styled.div`
    display: flex;
    gap: 0.4rem;
    p{
        font-size: 1.4rem;
    }
`

const StyledNegativeEmoticon = styled.div`
    display: flex;
    gap: 0.4rem;
    p{
        font-size: 1.4rem;
    }
`

const StyledCommentEmoticon = styled.div`
    display: flex;
    gap: 0.4rem;
    p{
        font-size: 1.4rem;
    }
`

const StyledLine = styled.hr`
    border-top: 0.1rem solid #000000;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    transform: matrix(1, 0, -0.01, 1, 0, 0);
    margin-top: 0.86rem;
`

const StyledBody = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1.327rem;
    margin-left:0.6rem;
    margin-right: 0.6rem;
    margin-bottom: 1.087rem;
`

const StyledContent = styled.div`
    font-size: 1.7rem;
    font-weight: 400;
    line-height: 2.1rem;
    color: #000000;
`

const StyledAmount = styled.div`
    font-size: 1.7rem;
    font-weight: 400;
    line-height: 2.1rem;
    color: #000000;
`

const StyledCommentArea = styled.div`
    margin: 1.19rem, 2.6rem, 2.4rem, 2.6rem;
`