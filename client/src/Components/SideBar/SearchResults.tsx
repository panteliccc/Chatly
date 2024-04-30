import ChatCard from "./ChatCard";
import { ScrollArea } from "../ui/scrollarea";
import { useChatState } from "../../Context/Provider";

interface Props {
  handleStartChat: (id: string) => void;
  visible: string;
}

const SearchResults = (props: Props) => {
  const chatState = useChatState();
  
  return (
    <ScrollArea className={`h-full w-full  flex flex-col ${props.visible}`}>
      {chatState.searchResults?.length === 0 ? (
        <div className="p-3">No results found</div>
      ) : (
        chatState.searchResults?.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              props.handleStartChat(user._id);
            }}
          >
            <ChatCard
              _id={user._id}
              chatName={(user.isGroup?user.chatName:user?.username) || ""}
              latestMessage={user.latestMessage}
              className="hover:bg-transparent"
            />
          </div>
        ))
      )}
    </ScrollArea>
  );
};

export default SearchResults;
