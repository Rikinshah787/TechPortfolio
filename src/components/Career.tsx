import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Project Manager</h4>
                <h5>Creative Business Solutions, Inc.</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Leading data visualization solutions, consolidated 5+ enterprise platforms into Power BI dashboards. Drove 30% increase in stakeholder engagement.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SAP PM / IT Grader</h4>
                <h5>Arizona State University</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Guided PM students on SAP concepts. Orchestrated feedback for 150+ students with 97% completion rate. Applied AI/ML techniques in academic projects.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SAP Consultant</h4>
                <h5>Deloitte India (Offices of the US)</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Executed 3 end-to-end SAP ERP implementations. Engineered ETL pipelines processing 3.2M+ records. Led Agile delivery across 12 sprints improving efficiency by 45%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>IT Analyst</h4>
                <h5>Infornation Techserve Pvt. Ltd.</h5>
              </div>
              <h3>2017</h3>
            </div>
            <p>
              Spearheaded project wireframes. Piloted 'Foodmantic' project. Led scrum activities for end-to-end development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Founder & Chess Instructor</h4>
                <h5>SmartKid Academy</h5>
              </div>
              <h3>2017</h3>
            </div>
            <p>
              Founded chess coaching platform serving 200+ students. Managed team of 6. Built and optimized website with SEO driving 100+ weekly active users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
