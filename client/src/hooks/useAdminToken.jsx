function removeadmintoken() {
  if (localStorage.getItem("adminToken")) {
    localStorage.removeItem("adminToken");
  }
}
export default removeadmintoken;
