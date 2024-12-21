import ApiError from "utils/ApiError"
import { BAD_REQUEST } from "constants/http";

const getUserData = async (userId: string): Promise<any[]> => {
  // Simulate an async task (e.g., database query or external API call)
  if (userId === "1") {
    return [{ id: 1, name: "John Doe" }];
  } else if (userId === "2") {
    return [{ id: 2, name: "Jane Doe" }];
  } else {
    throw new ApiError(BAD_REQUEST, "User not found", [{ field: "userId", message: "Invalid userId" }]);
  }
};