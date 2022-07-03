import Head from "next/head";
import React, { memo } from "react";
import Layout from "../../Layout";

const PrivacyPolicyPage: React.FC = memo(() => {
  return (
    <Layout>
      <Head>
        <title>GitHub Stats | Privacy Policy</title>
      </Head>

      <div className="px-4">
        <div className="mb-4">
          <h2 className="text-center text-4xl">Privacy Policy</h2>
        </div>

        <div className="mb-4 flex flex-col items-center">
          <h3 className="text-3xl">Disclaimer</h3>
          <div>
            While every effort has been made to ensure that the content and
            information on this site is as accurate as possible, it is possible
            that erroneous information may have been included, or that
            information may be out of date. Please understand that we are not
            responsible for any damage or loss caused by the content of this
            site.
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center">
          <h3 className="text-3xl">Use of Access Analysis Tools</h3>
          <div>
            This website uses Google Analytics, an access analysis tool provided
            by Google. Google Analytics uses cookies to collect traffic data.
            This traffic data is collected anonymously and is not personally
            identifiable. You can opt out of this feature by disabling cookies,
            so please check your browser settings. For more information about
            these terms, please see the{" "}
            <a
              className="text-blue-500 underline"
              href="https://marketingplatform.google.com/about/analytics/terms/us/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Google Analytics Terms of Service
            </a>
            .
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center">
          <div className="text-3xl">Updating Privacy Policy</div>
          <div>
            In addition to complying with the Japanese laws and regulations
            applicable to personal information, this website will review and
            improve the contents of this policy from time to time. The revised
            and updated privacy policy will always be disclosed on this page.
          </div>
        </div>
      </div>
    </Layout>
  );
});

PrivacyPolicyPage.displayName = "PrivacyPolicyPage";

export default PrivacyPolicyPage;
