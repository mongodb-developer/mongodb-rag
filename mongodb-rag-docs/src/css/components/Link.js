import React from "react";
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function UTMLink(props) {
  const context = useDocusaurusContext();
  const utmParams = context?.siteConfig?.customFields?.utmParams || '';
  const to = `${props.to}?${utmParams}`;
  return <Link {...props} to={to} />;
}
