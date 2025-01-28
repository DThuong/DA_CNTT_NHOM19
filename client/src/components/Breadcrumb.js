import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import icons from "../utils/icons";

const Breadcrumb = ({ title, category }) => {
  const { IoIosArrowForward } = icons;

  const routes = [
    { path: "/", breadcrumb: "Home" },
    { path: "/:category", breadcrumb: category },
    { path: "/:category/:pid/:title", breadcrumb: title },
  ];

  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <div className="text-sm flex items-center space-x-2 mt-2">
      {breadcrumbs
        ?.filter(({ match }) => match.route)
        .map(({ match, breadcrumb }, index, self) => (
          <React.Fragment key={match.pathname}>
            <Link
              to={match.pathname}
              className={`hover:text-main ${
                index === self.length - 1 ? "text-gray-500" : "text-black"
              }`}
            >
              {breadcrumb}
            </Link>
            {index !== self.length - 1 && (
              <IoIosArrowForward className="text-gray-400" />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default Breadcrumb;
