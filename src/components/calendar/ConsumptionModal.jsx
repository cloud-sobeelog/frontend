import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { ICCloseButton } from '../../assets';
import { client } from '../../libs/api';

const Tag = ({content, isTagClicked, onClick, index}) => {
    return ( 
        <>
            { isTagClicked ? 
                <StyledClickedTag onClick={()=>onClick(index)}>
                    <p>#{content}</p>
                </StyledClickedTag> :
                <StyledTag onClick={()=>onClick(index)}>
                    <p>#{content}</p>
                </StyledTag> 
            }   
        </>
        
    )
}

const CheckButton = ({children, isChecked, onChange}) => {
    return(
        <StyledCheckButton>
            <p>{children}</p>
            <StyledCheckInput 
                    type="checkbox" 
                    id= {children}
                    checked={isChecked} 
                    onChange={({target:{checked}})=>onChange(checked)} />
            <StyledCheckLabel htmlFor={children}/>  
        </StyledCheckButton>
        
    )
}

function ConsumptionModal({open, close, date, forceUpdateView}){
    const tagContentList = ['쇼핑', '음식', '생필품', '취미', '교통', '경조사'];
    const [content, setContent]  = useState();
    const [price, setPrice] = useState();
    const [isTagClicked, setIsTagClicked] = useState(false);
    const [tagContent, setTagContent] = useState('');
    const [secret, setSecret] = useState(true);
    const [check, setCheck] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));

    const tagClickHandler = (idx) => {
        const newArr = Array(tagContentList.length).fill(false);
        newArr[idx] = true;
        setIsTagClicked(newArr);
        setTagContent(tagContentList[idx]); //보내야할 태그값
    }

    const contentChangeHandler = (event) => {
        setContent(event.target.value);
    }

    const priceChangeHandler = (event) => {
        setPrice(event.target.value);
    }

    const secretClickHandler = async (checked) => {
        setSecret(checked);
        setCheck(checked);
    }

    const submitFormHandler = async (event) => {
        event.preventDefault();
        console.log(date);
        console.log(user.userID);
        const postData = {
            userID: user.userID,
            date: date,
            content: content,
            amount: price,
            category: tagContent,
            secret: secret,
        }
        const {data} =  await client.post(`/consumptions/`,{...postData});
        console.log(data);
        if(data.success){
            close();
            forceUpdateView(true);
            // window.location.replace("/calendar");
        }
    }

    useEffect(() => {
        if (open) {
            setContent('');
            setPrice('');
            setSecret(false);
            setTagContent('');
            setIsTagClicked(Array(tagContentList.length).fill(false));
            setCheck(false);
        }
    }, [open]);
    
    return(
        <>
            {open ? (
                <StyledBackDrop>
                    <StyledConsumptionModal>
                        <StyledHeader>
                            <p>오늘의 소비</p>
                            <ICCloseButton onClick={close} />
                        </StyledHeader>
                        <StyledForm onSubmit={submitFormHandler}>
                            <StyledContent>
                                <p>사용내역</p>
                                <StyledContentInput 
                                    placeholder='사용한 내역을 입력하세요' 
                                    name="content" 
                                    value={content} 
                                    onChange={contentChangeHandler}
                                />
                            </StyledContent>
                            <StyledAmount>
                                <p>가격</p>
                                <StyledAmountInput 
                                    placeholder='가격을 입력하세요'
                                    name="price"
                                    value={price}
                                    onChange={priceChangeHandler}
                                />
                            </StyledAmount>
                            <StyledTagBody>
                                <p>태그</p>
                                <StyledTagList>
                                    {tagContentList.map((element, index) => {
                                        return <Tag 
                                            key={index}
                                            isTagClicked={isTagClicked[index]}
                                            content={element} 
                                            onClick={tagClickHandler} 
                                            index={index}
                                        />
                                    })}
                                </StyledTagList>
                            </StyledTagBody>
                            <StyledBottom>
                                <CheckButton isChecked={check} onChange={secretClickHandler}>
                                    <p>비공개</p>                                
                                </CheckButton>
                                    <StyledSumbitButton type="submit"> 
                                        <p>작성</p>
                                    </StyledSumbitButton>
                            </StyledBottom>
                        </StyledForm>
                    </StyledConsumptionModal>
                </StyledBackDrop>
            ) : null}
        </>
    )
}

export default ConsumptionModal;

const StyledBackDrop = styled.div`
    z-index: 1; //위치지정 요소
    position: fixed;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color: rgba(0,0,0,0.4);
    top : 0;
    left : 0;
    right : 0;
    bottom : 0;
`
const StyledConsumptionModal = styled.div`
    padding: 5rem 3.5rem;
    background-color: ${props=>props.theme.colors.backgroundBlue};
    position: fixed;
    width: 36.1rem;
    height: 68.4rem;
    box-shadow: 0 0.4rem 0.4rem rgba(0, 0, 0, 0.25);
    border-radius: 2rem;
`

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    p{
        font-weight: 700;
        font-size: 2.4rem;
        line-height: 3.6rem;
        letter-spacing: 0.1rem;
        color: ${(props) => props.theme.colors.mainBlue};
    }
    svg{
        &:hover{
            path {
                fill: ${props=>props.theme.colors.mainBlue};
            }
        }
    }
`
const StyledForm = styled.form`
    margin-top: 5.756rem;
    display:flex;
    flex-direction: column;
    gap: 2.6rem;
`

const StyledContent = styled.div`
    display:flex;
    gap: 0.8rem;
    flex-direction: column;
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        line-height: 2.5rem;
        color: #000000;
        text-align: start;
        margin-left:0.8rem;
    }
`

const StyledContentInput = styled.input`
        padding: 2.2rem 1.59rem;
        width: 29.973rem;
        height: 4.25rem;
        border: none;
        border-radius:2rem;
        box-shadow: none;
        -webkit-appearance:none;
        -moz-appearance: none;
        -o-appearance:none;
        appearance: none;
        background: rgba(255, 255, 255, 0.79);
        ::placeholder{
            font-size: 2rem;
            font-weight: 400;
        }
        :focus{
            outline:none;
        }
`

const StyledAmount = styled.div`
    display:flex;
    flex-direction: column;
    gap: 0.8rem;
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        line-height: 2.5rem;
        color: #000000;
        text-align: start;
        margin-left:0.8rem;
    }
`

const StyledAmountInput = styled.input`
        padding: 0.5rem 1.59rem;
        width: 29.973rem;
        height: 4.25rem;
        border: none;
        border-radius:2rem;
        box-shadow: none;
        -webkit-appearance:none;
        -moz-appearance: none;
        -o-appearance:none;
        appearance: none;
        background: rgba(255, 255, 255, 0.79);
        ::placeholder{
            font-size: 2rem;
            font-weight: 400;
        }
        :focus{
            outline:none;
        }
`

const StyledTagBody = styled.div`
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        line-height: 2.5rem;
        color: #000000;
        text-align: start;
        margin-left:0.8rem;
    }
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`
const StyledTagList = styled.div`
    display: flex;
    gap: 0.555rem;
    flex-wrap: wrap;
    justify-content: center;
`

const StyledTag = styled.button`
    width: 8.86rem;
    height: 3.238rem;
    background: rgba(255, 255, 255, 0.79);
    border-radius: 2rem;
    display: flex;
    padding-top: 0.6rem 1rem;
    margin-right: 0;
    text-align: center;
    justify-content: center;
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 1.8rem;
        line-height: 1.8rem;
        align-self: center;
        color: black;
        margin: 0 auto;
        text-align: center;
    }
`

const StyledClickedTag = styled.button`
    width: 8.86rem;
    height: 3.238rem;
    background: rgba(44, 84, 228, 0.78);
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    padding-top: 0.6rem 1rem;
    margin-right: 0;
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 1.8rem;
        line-height: 1.8rem;
        align-self: center;
        margin: 0 auto;
        text-align: center;
        color: #FFFCFC;
    }
`
const StyledBottom = styled.div`
    display: flex;
    gap: 2.592rem;
    padding-top: 13rem;
    justify-content: flex-end;
`

const StyledCheckLabel = styled.label`
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;

    &:before {
        content:"";
        width: 2.684rem;
        height: 2.53rem;
        background: rgba(255, 255, 255, 0.79);
        border: 0.1rem solid #000000;
        border-radius: 0.5rem;
    }

    &:after {
        opacity: 0;
        content: "";
        position: absolute;
        width: 2.684rem;
        height: 2.53rem;
        border: 0.19rem solid black;
        border-radius: 0.5rem;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-size: 100% 100%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: rgba(44, 84, 228, 0.78);
    }

`

//visually hidden
const StyledCheckInput = styled.input`
    position: absolute;
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	width: 1px;
	height: 1px;
	overflow: hidden;
	white-space: nowrap;

    &:checked + ${StyledCheckLabel} {
        :after {
            opacity: 1;
        }
    }
`  

const StyledCheckButton = styled.div`
    display: flex;
    gap: 0.158rem;
    align-items: center;
    p{
        font-style: normal;
        font-weight: 400;
        font-size: 1.6rem;
        line-height: 1.6rem;
        margin-right: 0.376rem;
        color: #000000;
    }
`

const StyledSumbitButton = styled.button`
    width: 8.238rem;
    height: 5.059rem;

    background: rgba(255, 255, 255, 0.79);
    border-radius: 20px;

    p{
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        line-height: 2rem;

        color: #000000;
    }

    :hover{
        background: rgba(44, 84, 228, 0.78);
        p{
            color: #FFFCFC;
        }
    }
`
