import React from "react"
import App from "next/app"
import { TinaProvider, TinaCMS } from "tinacms"
import { GitClient, GitMediaStore } from "@tinacms/git-client"
import { useGithubEditing, GithubClient, TinacmsGithubProvider } from "react-tinacms-github"
import { Normalize } from "styled-normalize"
import { ThemeProvider } from "styled-components"
import theme from "../utils/theme"

// eslint-disable-next-line no-undef
require("typeface-source-code-pro")
import "./app.css"

class MyApp extends App {
  constructor(props) {
    super(props)
    console.log(process.env.BASE_BRANCH)
    const client = new GithubClient({
      proxy: "/api/proxy-github",
      authCallbackRoute: "/api/create-github-access-token",
      clientId: process.env.GITHUB_CLIENT_ID,
      baseRepoFullName: process.env.REPO_FULL_NAME, // e.g: tinacms/tinacms.org,
      baseBranch: process.env.BASE_BRANCH,
    })
    this.cms = new TinaCMS({
      apis: {
        /**
         * 2. Register the GithubClient
         */
        github: client,
        git: client,
      },
      /**
       * 3. Hide the Sidebar & Toolbar
       *    unless we're in Preview/Edit Mode
       */
      sidebar: {
        // hidden: process.env.NODE_ENV === "production",
        hidden: !props.pageProps.preview,
      },
      toolbar: {
        hidden: !props.pageProps.preview,
      },
    })

    // const client = new GitClient("http://localhost:3000/___tina")
    // this.cms.registerApi("git", client)
    // this.cms.media.store = new GitMediaStore(client)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <TinaProvider cms={this.cms}>
        <TinacmsGithubProvider
          editMode={pageProps.preview}
          enterEditMode={enterEditMode}
          exitEditMode={exitEditMode}
          error={pageProps.error}
        >
          <ThemeProvider theme={theme}>
            {/* <EditLink editMode={pageProps.preview} /> */}
            <Normalize />
            <Component {...pageProps} />
          </ThemeProvider>
        </TinacmsGithubProvider>
      </TinaProvider>
    )
  }
}

const enterEditMode = () => {
  return fetch(`/api/preview`).then(() => {
    window.location.href = window.location.pathname
  })
}

const exitEditMode = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload()
  })
}
export default MyApp
