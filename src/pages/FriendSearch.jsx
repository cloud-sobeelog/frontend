import { useState, useEffect } from 'react';
import { client } from "../libs/api";
import styled from 'styled-components';
import Navigator from '../components/common/Navigator';
import Header from '../components/common/Header';
import FriendSearchInput from '../components/friend/FriendSearchInput';
import FriendSearchList from '../components/friend/FriendSearchList';

function FriendSearch() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleInputKeyword = (event) => {
        setKeyword(event.target.value);
    };

    const handleSearchUsersByNickname = async (keyword) => {
        try {
          console.log("[검색어]:" + keyword);
          const response = await client.get(`/friends/search`, {
            params: {
              userId: user.userID,
              nickname: keyword
            }
          });
          const userList = response.data.data.userList;
          setSearchResults(userList);
          console.log("[검색결과]:" + userList);
        } catch (error) {
          console.log(error);
        }
      };
      
      useEffect(() => {
        handleSearchUsersByNickname(keyword);
      }, [keyword]);
      
      useEffect(() => {
      }, [searchResults]);
      

    return (
        <StyledFriend>
            <Header/>
            <StyledFriendList>
                <FriendSearchInput value={keyword} onChange={handleInputKeyword} onSubmit={() => handleSearchUsersByNickname(keyword)}/>
                <FriendSearchList results={searchResults}/>
            </StyledFriendList>
            <Navigator category="friend"/>
        </StyledFriend>
    );
}

export default FriendSearch;

const StyledFriend = styled.div`
    overflow-y:scroll;
    height: 80vh;
    margin-top: 8rem;
    margin-bottom: 10rem;
    ::-webkit-scrollbar {
        display: none;
    }
`;

const StyledFriendList = styled.div`
    display:flex;
    flex-direction: column;
    gap: 1.2rem;
`;