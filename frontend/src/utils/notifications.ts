import { showNotification, updateNotification } from "@mantine/notifications";

export const startNotification = (id: string) => {
  showNotification({
    id,
    loading: true,
    title: String("Loading..."),
    message: String("Loading..."),
    autoClose: false,
    disallowClose: true,
  });
};

export const warningNotification = (id: string, message: string) => {
  showNotification({
    id,
    color: "orange",
    title: String("Something went wrong!"),
    message: message,
  });
};

export const endNotification = (
  id: string,
  message: string,
  wasSuccessful: boolean
) => {
  updateNotification({
    id,
    color: wasSuccessful ? "green" : "red",
    title: wasSuccessful
      ? String("Successed")
      : String("Something went wrong!"),
    message,
    autoClose: 2000,
  });
};
