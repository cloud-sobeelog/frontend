import styled from 'styled-components';
import Header from '../components/common/Header2';
import { useState } from 'react';
import { client } from '../libs/api';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
        console.log(email);
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const submitFormHandler = async (event) => {
        event.preventDefault();
        console.log('클릭됨');
        const postData = {
            email: JSON.stringify(email),
            password: password,
        }
        const {data} =  await client.post(`/user/login`,{...postData});
        sessionStorage.setItem("user",JSON.stringify(data.data));
        navigate('/feed');
        // const user = JSON.parse(sessionStorage.getItem("user"));
        // console.log(user.userID);
    }

    return (
        <StyledLogin>
            <Header/>
            <StyledLoginForm onSubmit={submitFormHandler}>
                <p>아이디</p>
                <StyledBox1>
                    <input placeholder='이메일을 입력하세요' onChange={emailChangeHandler}/>
                </StyledBox1>
                <p>비밀번호</p>
                <StyledBox1>
                    <input type="password" placeholder='비밀번호를 입력하세요' onChange={passwordChangeHandler}/>
                </StyledBox1>
                <StyledBox2 type="submit">로그인</StyledBox2>
            </StyledLoginForm>
            <Container>
                <Word onClick={()=>navigate("/join")}>회원가입</Word>
                <Word>/</Word>
                <Word onClick={()=>navigate("/join")}>비밀번호 찾기</Word>
            </Container>
        </StyledLogin>
    );
}

export default Login;

const StyledLogin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

const StyledLoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
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
    margin-bottom: 3rem;
    padding: 0.7rem 1.3rem;
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
    margin-bottom: 7rem;
    color: #FFFFFF;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

// const Text1 = styled.div`
//     position: absolute;
//     top: 31%;
//     left: 20%;
//     font-size: 15px;
// `;

// const Text2 = styled.div`
//     position: absolute;
//     top: 41.5%;
//     left: 20%;
//     font-size: 15px;
// `;

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const Word = styled.button`
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    font-size: 12px;
`;