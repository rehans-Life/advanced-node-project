import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchBlog } from "../../actions";

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage(imageURL) {
    return (
      imageURL && (
        <img
          src={`https://blogs-bucket-123.s3.ap-southeast-1.amazonaws.com/${imageURL}`}
          height={250}
          width={250}
        />
      )
    );
  }

  render() {
    if (!this.props.blog) {
      return "";
    }

    const { title, content, imageURL } = this.props.blog;

    return (
      <div>
        {this.renderImage(imageURL)}
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
