design_decision_extraction_prompt = """
You are an expert in software architecture. Extract architectural design decisions from the given documents using this structure:

design_decision = A description of the set of architectural additions, subtractions and modifications to the software architecture, the rationale, and the design rules, design constraints and additional requirements that (partially) realize one or more requirements on a given architecture.
description = Detailed description of the design decision from the given documents
rationale = The reasons behind an architectural design decision are the rationale of an architectural design decision. It
describes why a change is made to the software architecture. Provide the rationate mentioned in the given documents. 
design_rules = Rules are mandatory guidelines, prescriptions for further design decisions
design_constraints = Design constraints describe the opposite side of design rules. They describe what is not allowed in the future of the design, i.e. they prohibit certain behaviors
quality_attribute = Provide the impacted quality attributes from this design decision in the given documents. 

If some of these values are not available in the text, leave them blank.

Now extract architectural design decisions from this input. Follow the same structure. Make sure to extract only architectural design decisions. Provide the response in JSON format.

Example: 
{{
    "design_decisions": [
        {{
            "decision": "The test result server is a separate component in the Corona Warn App system.",
            "rationale": "The Test Result Server handles pseudonymised health data, this data needs a high level of protection. This is the reason why this component, although it does simple CRUD operations is put in a separate component.
The data is protected by several measures.",
            "design_rule": "The Test Result Server provides test results of SARS-CoV-2 tests in a pseudonymized form to only the verification server as it requests such information.",
            "constraint": "The Test Result Server and Verification Server are operated by different operating teams and run in different namespaces in one cloud tenant. The namespaces organize access rights to different group of people, such as operation teams.",
            "impacted_quality_attributes": ["Security", "Privacy"],
            "impacted_sustainability_dimensions": ["Technical", "Social"],
            "description": "The primary scope of the component is to provide the verification server with information of lab test results of SARS-CoV-2 tested people."
        }},
        {{
            "decision": "Data collection by Corona-Warn-App is limited to the minimum data required for the app to function.",
            "rationale": "As mandated by the General Data Protection Regulation (GDPR), data minimization is a paramount principle in the implementation of the Corona-Warn-App.",
            "design_rule": "The diagnosis keys are only stored centrally for the epidemiologically relevant period of 14 days and are removed automatically after that period.",
            "constraint": "Location data is not and cannot be collected by apps using the Exposure Notification framework.",
            "impacted_quality_attributes": ["Security", "Privacy"],
            "impacted_sustainability_dimensions": ["Technical", "Social"],
            "description": "Users only provide the following input: Permission to use the Exposure Notification framework, QR Code scan during testing, TeleTAN in case of hotline-based result verification, Consent to upload daily diagnosis keys"
        }}
    ]
}}
"""
qa_extraction_prompt = """
You are an expert in software architecture. Extract quality attributes from the given documents using this structure:

quality_attribute = A quality attribute (QA) is a measurable or testable property of a system that is used to indicate how well the system satisfies the needs of its stakeholders beyond the basic function of the system. Each quality attribute can be defined by the following parts:
stimulus = We use the term “stimulus” to describe an event arriving at the system or the project. The stimulus can be an event to the performance community, a user operation to the usability community, or an attack to the security community, and so forth. We use the same term to describe a motivating action for developmental qualities. Thus a stimulus for modifiability is a request for a modification; a stimulus for testability is the completion of a unit of development.
stimulus_source = A stimulus must have a source—it must come from somewhere. stimulus. The source of the stimulus may affect how it is treated by the system. A request from a trusted user will not undergo the same scrutiny as a request by an untrusted user. Some entity (a human, a computer system, or any other actor) must have generated the 
response = The response is the activity that occurs as the result of the arrival of the stimulus. The response is something the architect undertakes to satisfy. It consists of the responsibilities that the system (for runtime qualities) or the developers (for developmenttime qualities) should perform in response to the stimulus. For example, in a performance scenario, an event arrives (the stimulus) and the system should process that event and generate a response. In a modifiability scenario, a request for a modification arrives (the stimulus) and the developers should implement the modification—without side effects—and then test and deploy the modification
response_measure = When the response occurs, it should be measurable in some fashion so that the scenario can be tested—that is, so that we can determine if the architect achieved it. For performance, this could be a measure of latency or throughput; for modifiability, it could be the labor or wall clock time required to make, test, and deploy the modification.
environment = The environment is the set of circumstances in which the scenario takes place. Often this refers to a runtime state: The system may be in an overload condition or in normal operation, or some other relevant state. For many systems, “normal” operation can refer to one of a number of modes. For these kinds of systems, the environment should specify in which mode the system is executing. But the environment can also refer to states in which the system is not running at all: when it is in development, or testing, or refreshing its data, or recharging its battery between runs. The environment sets the context for the rest of the scenario. For example, a request for a modification that arrives after the code has been frozen for a release may be treated differently than one that arrives before the freeze. The fifth successive failure of a component may be treated differently than the first failure of that component
artifact = The stimulus arrives at some target. This is often captured as just the system or project itself, but it’s helpful to be more precise if possible. The artifact may be a collection of systems, the whole system, or one or more pieces of the system. A failure or a change request may affect just a small portion of the system. A failure in a data store may be treated differently than a failure in the metadata store. Modifications to the user interface may have faster response times than modifications to the middleware.
sustainability_dimensions = Identify which sustainability dimensions (Economic, Environmental, Social, Technical) are impacted by this quality attributewithin the context of the documents. 
description = Detailed description of the quality attribute, along with the stimulus, stimulus source, response, response measure, artifact and environment from the given documents.
If some of these values are not available in the text, leave them blank.

Each quality attribute might have mutiple instances of stimulus, stimulus source, response, response measure, environment, artifact. Provide all of these quality attributes from the given documents. 
Now extract quality attributes from this input. Follow the same structure.  Provide the response in JSON format.

Example: 
{{
    "quality_attributes": [
        {{
            "quality_attribute": "Privacy",
            "description": "As an app user, the first time I launch the app, I want to be notified about the terms of use and privacy provisions (data privacy screen) and grant my consent, so that I know how my data will be used within the app.",
            "stimulus": "App user",
            "stimulus_source": "Launches app for the first time",
            "response": "Displays terms of use, privacy provisions, and obtains consent",
            "response_measure": "Consent stored and not requested again",
            "environment": "Initial setup",
            "artifact": "User interface, onboarding module",
            "sustainability_dimension": ["Technical", "Social"]
        }},
         {{
            "quality_attribute": "Usability",
            "description": "Accessibility regarding contrast and font size/type is provided depending on the options available in the respective operating system.",
            "stimulus": "App user with accessibility needs",
            "stimulus_source": "Uses UI features",
            "response": "Supports screen readers, contrast settings, modifiable font sizes",
            "response_measure": "Accessible experience for users",
            "environment": "Initial and ongoing usage,
            "artifact": "App UI",
            "sustainability_dimension": ["Technical", "Social"]
        }}
    ]
}}
"""