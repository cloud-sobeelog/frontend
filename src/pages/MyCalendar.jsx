import styled from 'styled-components';
import Navigator from '../components/common/Navigator';
import { Calendar } from '../components/calendar/Calendar';
import TotalAmount from '../components/calendar/TotalAmount';
import CalendarConsumption from '../components/calendar/CalendarConsumption';
import { useState, useEffect } from 'react';
import { consumptionList } from '../mock-data/consumptionList';
import Header from '../components/common/Header';
import { format } from "date-fns";
import { ICAddButton } from '../assets';
import ConsumptionModal from '../components/calendar/ConsumptionModal';
import { client } from '../libs/api';
import { useNavigate } from 'react-router-dom';



function MyCalendar() {
    const navigate = useNavigate();
    const today = new Date();
    const defaultDate = format(today, 'yyyy-MM-dd');
    const [list, setList] = useState();
    const [chosenDate, setChosenDate] = useState(defaultDate);
    const [modalOpen, setModalOpen] = useState(false);
    const [todayAmount, setTodayAmount] = useState(0);
    const [updateView, setUpdateView] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userID = user?.userID; // 추가적인 null 체크

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const getConsumptionListDataByDate = async (date) => {
        if (!date || !userID) {
            console.error("Invalid date or userID");
            return;
        }
        try {
            const { data } = await client.get(`/view/date/${date}/${userID}`);
            setList(data.data.result);
        } catch (error) {
            console.error("Error fetching data:", error);
            // 추가적인 사용자 피드백 로직 (예: 토스트 메시지) 추가 가능
        }
    };
    
    const getTodayAmount = async (date) => {
        if (!date || !userID) {
            console.error("Invalid date or userID");
            return;
        }
        try {
            const { data } = await client.get(`/consumptions/amount/${date}/${userID}`);
            JSON.stringify(data);
            const amount = data.data.amount[0]?.t_amount || 0;
            
            setTodayAmount(amount);
        } catch (error) {
            console.error("Error fetching amount data:", error);
            // 추가적인 사용자 피드백 로직 (예: 토스트 메시지) 추가 가능
        }
    };

    useEffect(()=> {
        getConsumptionListDataByDate(chosenDate);
        getTodayAmount(chosenDate);
    },[chosenDate, updateView])

    const forceUpdateView = () => {
        setUpdateView(prev => !prev);
    }

    return (
        <>
        <Header/>
        <StyledMyCalendar>
            <Calendar onClick={setChosenDate}/>
            <TotalAmount amount={todayAmount}/>
            <StyledConsumptionList>
                {list && list.map((element) => {
                    return <CalendarConsumption 
                    info={element} 
                    key={element.chistoryID} 
                    onClick={()=>navigate(`/consumptionDetail?id=${element.cHistoryID}`)}
                    />
                })}
            </StyledConsumptionList>
            <StyledButton>
                <ICAddButton onClick={openModal}/>
                <ConsumptionModal open={modalOpen} close={closeModal} date={chosenDate} forceUpdateView={forceUpdateView}/>
            </StyledButton>
        </StyledMyCalendar>
        <Navigator category="calendar" />
        </>
    );
}

export default MyCalendar;

const StyledMyCalendar = styled.div`
    overflow-y:scroll;
    height: 90vh;
    margin-bottom: 8.2rem;
    ::-webkit-scrollbar {
        display: none;
    }
`;

const StyledConsumptionList = styled.div`
`
const StyledButton = styled.button`
    position: fixed;
    z-index: 20;
    bottom: 9.1rem;
    right: 2rem;
    padding: 0;
    margin: 0;
    svg {
        fill: ${(props) => props.theme.colors.mainBlue};
        fill-opacity: 0.5;
    }
`