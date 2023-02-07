import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import "./Home.css";

export default function Home(){
    const [events, setEvents] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if(!isAuthenticated) {
                return;
            }

            try {
                const events = await API.get("events", "/events");
                setEvents(events)
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated])


    function renderEventsList(events) {
        return (
            <>
              <LinkContainer to="/events/new">
                <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                  <span className="ml-2 font-weight-bold"> + Create a new event</span>
                </ListGroup.Item>
              </LinkContainer>
              {events.map(({ eventId, content, createdAt }) => (
                <LinkContainer key={eventId} to={`/events/${eventId}`}>
                  <ListGroup.Item action>
                    <span className="font-weight-bold">
                      {content.trim().split("\n")[0]}
                    </span>
                    <br />
                    <span className="text-muted">
                      Created: {new Date(createdAt).toLocaleString()}
                    </span>
                  </ListGroup.Item>
                </LinkContainer>
              ))}
            </>
          );
    }

    function renderLander() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Event data analyzer</h1>
                    <p className="text-muted">Data analyzer</p>
                </div>
            </div>
        )
    }

    function renderEvents(){
        return (
            <div className="events">
              <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Events</h2>
              <ListGroup>{!isLoading && renderEventsList(events)}</ListGroup>
            </div>
          );
    }

    return (
        <div className="Home">
          {isAuthenticated ? renderEvents() : renderLander()}
        </div>
      );
}