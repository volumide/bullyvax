import React, { FunctionComponent, useEffect } from "react"
import Axios from "axios"

interface MessageToMomsProps {}

const BullyPolicy: FunctionComponent<MessageToMomsProps> = () => {
  const [response, setResponse] = React.useState({} as any)
  const [loading, setLoading] = React.useState(false)
  const [selectedPage] = React.useState("Bully Discipline Policy")

  let url: string

  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  let fetchContent = async (q: { page?: string; tab?: string }) => {
    setLoading(true)
    try {
      let res = await Axios({
        method: "get",
        url: `${url + "/content"}?page=${q.page}&tab=${q.tab}`
      })

      console.log("res.data", res.data, response, loading)

      setResponse(res.data)

      setLoading(false)
    } catch (error: any) {
      console.log(error.response)
      setResponse(error.response)
      setLoading(false)
    }
  }

  useEffect(() => {
    let abortController = new AbortController()
    fetchContent({ page: selectedPage, tab: "" })
    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line
  }, [selectedPage])

  return (
    <div style={{ width: "100%" }}>
      <div dangerouslySetInnerHTML={{ __html: response?.content }}></div>
    </div>
  )
}

export default BullyPolicy
