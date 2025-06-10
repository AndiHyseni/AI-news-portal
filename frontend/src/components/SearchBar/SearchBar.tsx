import { TextInput, ActionIcon } from "@mantine/core";
import { Search, X } from "tabler-icons-react";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search by title...",
}) => {
  return (
    <div className="search-bar">
      <TextInput
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        icon={<Search size={18} />}
        rightSection={
          value && (
            <ActionIcon onClick={() => onChange("")}>
              <X size={18} />
            </ActionIcon>
          )
        }
        styles={{
          input: {
            "&:focus": {
              borderColor: "#4b21b0",
            },
          },
        }}
      />
    </div>
  );
};
