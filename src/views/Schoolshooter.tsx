import React, { FunctionComponent, useEffect } from "react"
import Axios from "axios"
interface SchooSHooterProps {}

const Schoolshooter: FunctionComponent<SchooSHooterProps> = () => {
  const [loading, setLoading] = React.useState(false)
  const [selectedPage] = React.useState("School Shooter")
  const [response, setResponse] = React.useState({} as any)

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

  let content =
    "Many people still ask who are school shooters? Where do they come from? Why do they commit these horrible acts? To answer this we must first go back to a word that was first introduced in 2010; “Bullycide”. Bullycide means bullied to the point of suicide; bullied to death. There is a chilling statement that says, “when a student decides that their life is no longer worth living because of the persecution they face every day from their classmates and peers, the bullycide victim is born.” It goes on to say, “when a bullycide victim decides that those who persecuted them to death, as well as those who stood idly by and did nothing should also go to their graves, the school shooter is born.  <p> The only way to protect students is to stop the shooter before they walk in the schoolhouse door, once they are inside with a weapon the shooter has won. The only question is how much damage have they done.<p> Almost all school shooters leave a long trail of warnings before they strike. The key is to have a system that other students will trust to report these warnings and also a system that demands that administrators immediately and properly react to these warnings.</p>"

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

export default Schoolshooter
