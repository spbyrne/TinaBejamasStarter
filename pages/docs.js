import Head from "@components/head"
import Layout from "@components/layout"
import Container from "@components/container"

import { parseNestedDocsMds } from '@utils'

const Docs = ({ allDocs }) => {
  return (
    <Layout allDocs={allDocs}>
      <Head title="Docs" />
      <Container>
        <h1>Docs</h1>
      </Container>
    </Layout>
  )
}

Docs.getInitialProps = async () => {
	const docs = (context => {
    const keys = context.keys()
		const data = keys.reduce((newData, key) => {
      newData = parseNestedDocsMds(key, newData)
			return newData;
    }, [])
		return data
	})(require.context('@docs', true, /\.md$/))
	return {
		allDocs: docs
	}
}

export default Docs
