import React, { useRef, useState, useEffect }  from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { onError } from "../lib/errorLib";
import { s3Upload } from "../lib/awsLib";
import "./Events.css";

export default function Events() {
    const file = useRef(null);
    const { id } = useParams();
    const nav = useNavigate();
    const [event, setEvent] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      function loadEvent() {
        return API.get("events", `/events/${id}`)
      }

      async function onLoad() {
        try {
            const event = await loadEvent();
            const { content, attachment } = event;

            if(attachment) {
                event.attachmentUrl = await Storage.vault.get(attachment);
                console.log(`event ${JSON.stringify(event, null, 2)}`)
            }

            setContent(content);
            setEvent(event);
        } catch (e) {
            onError(e);
        }
      }
    
      onLoad();
    }, [id])
    
    function validateForm() {
        return content.length > 0;
      }
      
    function formatFilename(str) {
    return str.replace(/^\w+-/, "");
    }
    
    function handleFileChange(event) {
    file.current = event.target.files[0];
    }
      
    function saveEvent(event) {
        return API.put("events", `/events/${id}`, {
          body: event,
        });
      }
      
    async function handleSubmit(event) {
        let attachment;
      
        event.preventDefault();
      
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
          alert(
            `Please pick a file smaller than ${
              config.MAX_ATTACHMENT_SIZE / 1000000
            } MB.`
          );
          return;
        }
      
        setIsLoading(true);
      
        try {
          if (file.current) {
            attachment = await s3Upload(file.current);
          }
      
          await saveEvent({
            content,
            attachment: attachment || event.attachment,
          });
          nav("/");
        } catch (e) {
          onError(e);
          setIsLoading(false);
        }
      }
    
      function deleteEvent() {
        return API.del("events", `/events/${id}`);
      }
      
      async function handleDelete(event) {
        event.preventDefault();
      
        const confirmed = window.confirm(
          "Are you sure you want to delete this event?"
        );
      
        if (!confirmed) {
          return;
        }
      
        setIsDeleting(true);
      
        try {
          await deleteEvent();
          nav("/");
        } catch (e) {
          onError(e);
          setIsDeleting(false);
        }
      }
    
    return (
    <div className="Events">
        {event && (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="content">
            <Form.Control
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            </Form.Group>
            <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {event.attachment && (
                <p>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={event.attachmentUrl}
                    >
                        {formatFilename(event.attachment)}
                    </a>
                </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
            <LoaderButton
            block="true"
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
            >
            Save
            </LoaderButton>
            <LoaderButton
            block="true"
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            >
            Delete
            </LoaderButton>
        </Form>
        )}
    </div>
    );
}