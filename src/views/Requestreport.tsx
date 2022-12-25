import React, { FunctionComponent, useEffect } from "react"
import Axios from "axios"

interface RequestReportProps {}

const Requestreport: FunctionComponent<RequestReportProps> = () => {
  const [loading, setLoading] = React.useState(false)
  // const [selectedPage] = React.useState("Bully Free");
  const [response, setResponse] = React.useState({} as any)
  const [selectedPage] = React.useState("Request Report")

  let url: string

  if (process.env.NODE_ENV === "development") {
    url = `${process.env.REACT_APP_DEV_BACKEND}`
  } else if (process.env.NODE_ENV === "production") {
    url = `https://bullyvax.onrender.com`
  }

  let content =
    "What separates BullyVaxx from all other bully control systems is all bully reports submitted through BullyVaxx can be accessed and used as evidence in court if necessary to stop the abuse of a student. <p>It is very rare that BullyVaxx reports are needed because school administrators will shut down a bully at school long before they will challenge the BullyVaxx system in court. School administrators know that laying down these reports in court before a judge and jury is virtually impossible to defend against. When the situations arise where these reports are needed in order to stop the abuse of a student there is a strict, step by step process BullyVaxx uses in order to protect the private information of all students involved in the incident and ensure that no state or federal laws are violated:</p><p>If you are considering legal action to stop the abuse of your child at school and you would like to access the “Bully File” of the student abusing your child our staff will be required to address your request individually and privately. There will be an administrative charge of $25 for this to cover the costs involved. If you are a family that is below the poverty level you should contact an attorney, have them take your case pro bono and we will provide them with the reports and they can pay for them once the settlement is reached.</p><p>To continue please click HERE.</p>"

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

export default Requestreport
