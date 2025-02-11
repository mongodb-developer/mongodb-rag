import React from "react";
import BrowserWindow from "@site/src/components/BrowserWindow";
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Screenshot(props) {
  return (
    <BrowserWindow {...props}>
      <img src={useBaseUrl(props.src)} alt={props.alt} />
    </BrowserWindow>
  )
};