import { Link } from "react-router-dom";

const UnauthorizedForm = () => (
  <div>
    <h1>Unauthorized page</h1>
    <p>You don't have permission to access this page.</p>
    <Link to="/signin">Go back to login.</Link>
  </div>
);

export default UnauthorizedForm;