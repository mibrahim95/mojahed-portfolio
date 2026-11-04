import { useState } from "react";
import { Header, Message, Button, Grid, Modal, Image } from "semantic-ui-react";
import experiences from "../../json/expList.json";
import ExperienceItem from "./experienceItem";

const RESUME_SRC = "/MojahedResume2022.jpg";

function ExpList() {
  const [open, setOpen] = useState(false);

  return (
    <section id="experience" className="section">
      <Header as="h2" size="huge" dividing>
        Experience
      </Header>

      <Grid stackable divided="vertically">
        {experiences.map((experience, index) => (
          <ExperienceItem
            key={experience.id}
            experience={experience}
            flipped={index % 2 === 1}
          />
        ))}
      </Grid>

      <Message info className="mt-20" style={{ textAlign: "center" }}>
        <Message.Header>Want the full picture?</Message.Header>
        <p>View or download my full résumé.</p>
        <Modal
          basic
          size="small"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          trigger={<Button color="black">View Full Résumé</Button>}
        >
          <Modal.Content>
            <Image src={RESUME_SRC} alt="Mojahed Ibrahim's résumé" centered />
          </Modal.Content>
          <Modal.Actions>
            <Button
              as="a"
              href={RESUME_SRC}
              download="Mojahed-Ibrahim-Resume.jpg"
              basic
              inverted
              color="blue"
              icon="download"
              content="Download"
            />
            <Button
              basic
              inverted
              color="red"
              content="Close"
              onClick={() => setOpen(false)}
            />
          </Modal.Actions>
        </Modal>
      </Message>
    </section>
  );
}

export default ExpList;
