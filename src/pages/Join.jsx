import React,{useState} from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header2';
import { client } from '../libs/api';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


function Join() {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [nickname, setNickname] = useState();

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
        console.log(email);
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const password2ChangeHandler = (event) => {
        setPassword2(event.target.value);
    }

    const nicknameChangeHandler = (event) => {
        setNickname(event.target.value);
    }

    const submitFormHandler = async (event) => {
        event.preventDefault();
        console.log('클릭됨');
        const postData = {
            email: JSON.stringify(email),
            password: password,
            password2: password2,
            nickname: JSON.stringify(nickname),
        }
        try{
            const {data} =  await client.post(`/user/join`,{...postData});
            console.log(data.message);
            if(data.success){
                alert("회원가입 성공");
                navigate('/login');
            }
            else{
                alert(data.message);
            }
        } catch(error){
            if(axios.isAxiosError(error)){
                alert(error.response.data.message);
            }
        }
        // else{
        //     console.log(data.response);
        // }
    }
    return (
        <StyledJoin>
            <Header/>
            <StyledForm onSubmit={submitFormHandler}>
                <p>아이디</p>
                <StyledBox1>
                    <input placeholder='아이디를 입력하세요' onChange={emailChangeHandler}/>
                </StyledBox1>
                <p>비밀번호</p>
                <StyledBox1>
                    <input type="password" placeholder='비밀번호를 입력하세요' onChange={passwordChangeHandler}/>
                </StyledBox1>
                <p>비밀번호 확인</p>
                <StyledBox1>
                    <input type="password" placeholder='비밀번호를 한 번 더 입력하세요' onChange={password2ChangeHandler}/>
                </StyledBox1>
                <p>닉네임</p>
                <StyledBox1>
                    <input placeholder='닉네임을 입력하세요' onChange={nicknameChangeHandler}/>
                </StyledBox1>
                <StyledBox2 type="submit">
                    회원 가입
                </StyledBox2>
            </StyledForm>
        </StyledJoin>
    );
}

export default Join;

const StyledJoin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    margin-top: 3.9rem;
    p{
        font-size: 15px;
    }
`

const StyledBox1 = styled.div`
    display: flex;
    height: 4rem;
    width: 25rem;
    background-color: #FFFFFF;
    border-radius: 1rem;
    border: 1px solid #000000;
    padding: 0.7rem 1.3rem;
    gap: 0.8rem;
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
    
`;

const StyledBox2 = styled.button`
    display: flex;
    height: 4rem;
    width: 25rem;
    background-color: rgba(44, 84, 228, 0.8);
    border-radius: 1rem;
    margin-top: 5rem;
    color: #FFFFFF;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

// const Text1 = styled.div`
//     position: absolute;
//     top: 32%;
//     left: 20%;
//     font-size: 15px;
// `;

// const Text2 = styled.div`
//     position: absolute;
//     top: 42.5%;
//     left: 20%;
//     font-size: 15px;
// `;

// const Text3 = styled.div`
//     position: absolute;
//     top: 53.5%;
//     left: 20%;
//     font-size: 15px;
// `;