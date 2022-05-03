import React from "react";
import ReactMarkdown from "react-markdown";

class ParseGist extends React.PureComponent {
  componentDidMount() {
    this._updateBody();
  }

  _updateBody() {
    const gists = document.getElementsByClassName("language-gist");
    const gistURL = "https://gist.github.com/";
    let totalNoOfGist = gists.length;

    while (totalNoOfGist > 0) {
      let gistLink = gists[0].innerText;
      gistLink = gistLink.trim(); // remove any white spaces
      let startWith = gistLink.indexOf(gistURL);
      let endWith = gistLink.slice(gistLink.length - 3);
      if (startWith === 0 && endWith === ".js") {
        // check if url is starting with gistURL and ending with ".js"
        let id = gistLink.slice(gistURL.length, gistLink.length - 3); // create the id consist of username/gistId

        // create an iFrameNode
        let iFrameNode = document.createElement("iframe");
        iFrameNode.width = "100%";
        iFrameNode.id = id;
        gists[0].parentNode.replaceWith(iFrameNode);

        let doc;
        if (iFrameNode.contentDocument) doc = iFrameNode.contentDocument;
        else if (iFrameNode.contentWindow)
          doc = iFrameNode.contentWindow.document;

        let gistScript = `<script type="text/javascript" src="${gistLink}"></script>`;
        const styles = "<style>*{font-size:12px;}</style>";
        const resizeScript = `onload="parent.document.getElementById('${id}').style.height=document.body.scrollHeight + 'px'"`;
        const iframeHtml = `<html lang="eng"><head><base target="_parent"><title>Gist</title>${styles}</head><body ${resizeScript}>${gistScript}</body></html>`;
        doc.open();
        doc.writeln(iframeHtml);
        doc.close();
      }
      totalNoOfGist--;
    }
  }
  render() {
    const { body } = this.props;
    return <ReactMarkdown children={body} />;
  }
}

export default ParseGist;
