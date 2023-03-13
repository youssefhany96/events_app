import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const SingleEvent = ({ data }) => {
  const emailRef = useRef();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const eventId = router?.query.id;

    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailValue.match(validRegex)) {
      setMessage("Please introduce a correct email address");
    }

    try {
      const response = await fetch("/api/email-registration", {
        method: "POST",
        body: JSON.stringify({ email: emailValue, eventId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
      emailRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="event_single_page">
      <h1> {data.title} </h1>
      <Image src={data.image} width={1000} height={500} alt={data.title} />
      <p> {data.description} </p>

      <form onSubmit={handleSubmit} className="email_registration">
        <label> Get Registered for this event!</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          placeholder="Please input your email here"
        />
        <button type="submit"> Submit </button>
        <p> {message} </p>
      </form>
    </div>
  );
};

export default SingleEvent;
