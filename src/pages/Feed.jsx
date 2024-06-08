import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import Navigator from '../components/common/Navigator';
import Header from '../components/common/Header';
import CalendarConsumption from '../components/calendar/CalendarConsumption';
import { client } from '../libs/api';
import { useNavigate } from 'react-router-dom';

function Feed() {
    const navigate = useNavigate();
    const [feedList, setFeedList] = useState();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const getFeedListData = async () => {
        const {data} = await client.get(`/view/${user.userID}`);
        console.log(data.data.feedList);
        setFeedList(data.data.feedList);
    }
    
    
    useEffect(() => {
        getFeedListData();
    },[]);

    return (
        <StyledFeed>
            <Header/>
            <StyledFeedList>
                {feedList && feedList.map((element)=>{
                    return <CalendarConsumption 
                        info={element} 
                        key={element.cHistoryID}
                        onClick={()=>navigate(`/consumptionDetail?id=${element.cHistoryID}`)}
                    ></CalendarConsumption> 
                })}
            </StyledFeedList>
            <Navigator category="feed" />
        </StyledFeed>
    );
}

export default Feed;

const StyledFeed = styled.div`
    overflow-y:scroll;
    height: 80vh;
    margin-top: 8rem;
    margin-bottom: 10rem;
    ::-webkit-scrollbar {
        display: none;
    }
`

const StyledFeedList = styled.div`
    display:flex;
    flex-direction: column;
    gap: 1.2rem;
`;