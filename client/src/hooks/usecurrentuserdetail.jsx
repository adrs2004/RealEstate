import { useSelector } from "react-redux";

function useCurrentUserDetail() {
  const { currentUser } = useSelector((state) => state.user);

  if (
    currentUser?.Age &&
    currentUser?.firstname &&
    currentUser?.lastname &&
    currentUser?.phone
  ) {
    return true;
  }
  return false;
}

export default useCurrentUserDetail;
