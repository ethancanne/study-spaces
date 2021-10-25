import React from "react";

/**
* Renders a page.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class Page extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="page" {...this.props}>
        { this.props.children }
      </div>
    )
  }
}

export default Page;
