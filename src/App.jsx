import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const webhookUrl = "WEBHOOKURL";
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        needs: "",
        budget: "",
        timeline: "",
    });
    const [otherValues, setOtherValues] = useState({ needs: "", budget: "", timeline: "" });
    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOtherChange = (name, value) => {
        setOtherValues({ ...otherValues, [name]: value });
        setFormData({ ...formData, [name]: "Autre" });
    };

    const handleRadioChange = (name, value) => {
        if (value !== "Autre") {
            setFormData({ ...formData, [name]: value });
            setOtherValues({ ...otherValues, [name]: "" });
        } else {
            setFormData({ ...formData, [name]: "Autre" });
        }
    };

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.name === "" || formData.email === "" || formData.message === "") {
                alert("Veuillez remplir tous les champs");
                return;
            }

            setIsLoading(true);

            const finalFormData = {
                ...formData,
                needs: formData.needs === "Autre" ? otherValues.needs : formData.needs,
                budget: formData.budget === "Autre" ? otherValues.budget : formData.budget,
                timeline: formData.timeline === "Autre" ? otherValues.timeline : formData.timeline,
            };


            const response = await axios.post(webhookUrl, finalFormData);

            setResponseMessage(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            setResponseMessage("Une erreur s'est produite. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setFormData({
            name: "",
            email: "",
            message: "",
            needs: "",
            budget: "",
            timeline: "",
        });
        setOtherValues({ needs: "", budget: "", timeline: "" });
        setResponseMessage("");
        setStep(1);
    };

    if(webhookUrl === "WEBHOOKURL") {
        return (
            <div className="container">
                <p style={{color:'red'}}>Veuillez ajouter votre URL de webhook dans le fichier src/App.jsx</p>
                <pre>const webhookUrl = "";</pre>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Questionnaire Digital</h1>

            {responseMessage && (
                <div className="response">
                    <div className="faisabilite">
                        <strong>• Faisabilité :</strong>
                        <p>{responseMessage.split("• Justification :")[0].replace("• Faisabilité :", "").trim()}</p>
                    </div>
                    <div className="justification">
                        <strong>• Justification :</strong>
                        <p>{responseMessage.split("• Justification :")[1].split("• Suggestions :")[0].trim()}</p>
                    </div>
                    <div className="suggestions">
                        <strong>• Suggestions :</strong>
                        <p>{responseMessage.split("• Suggestions :")[1].trim()}</p>
                    </div>

                    <button onClick={handleRetry} className="retry-button">
                        Réessayer
                    </button>
                </div>
            )}

            {!responseMessage && (
                <div className="form-content">
                    {step === 1 && (
                        <div className="question">
                            <h2>Question 1 : Quels sont vos besoins principaux ?</h2>
                            <div className="radio-group">
                                {[
                                    { value: "Site web", label: "Site web", icon: "🌐" },
                                    { value: "Application mobile", label: "Application mobile", icon: "📱" },
                                    { value: "SEO et Marketing digital", label: "SEO et Marketing digital", icon: "🚀" },
                                    { value: "Refonte de site", label: "Refonte de site", icon: "🔄" },
                                    { value: "Gestion de projet", label: "Gestion de projet", icon: "📊" },
                                    { value: "Autre", label: "Autre", icon: "❓" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`radio-card ${
                                            formData.needs === option.value ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="needs"
                                            value={option.value}
                                            checked={formData.needs === option.value}
                                            onChange={() => handleRadioChange("needs", option.value)}
                                        />
                                        <span>{option.icon}</span>
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.needs === "Autre" && (
                                <textarea
                                    name="needs"
                                    style={{width:'100%',maxWidth:'100%', height:'80px', resize:'vertical', maxHeight:'200px', minHeight:'40px'}}
                                    value={otherValues.needs}
                                    onChange={(e) => handleOtherChange("needs", e.target.value)}
                                    placeholder="Entrez votre besoin spécifique ici..."
                                    required
                                />
                            )}
                            <br/>
                            <button onClick={handleNextStep}>Suivant</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="question">
                            <h2>Question 2 : Quel est votre budget estimé ?</h2>
                            <div className="radio-group">
                                {[
                                    { value: "500€", label: "500€", icon: "💰" },
                                    { value: "1000€", label: "1000€", icon: "💰💰" },
                                    { value: "3000€", label: "3000€", icon: "💰💰💰" },
                                    { value: "5000€", label: "5000€", icon: "💰💰💰💰" },
                                    { value: "10000€", label: "10000€", icon: "💰💰💰💰💰" },
                                    { value: "Autre", label: "Autre", icon: "❓" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`radio-card ${
                                            formData.budget === option.value ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="budget"
                                            value={option.value}
                                            checked={formData.budget === option.value}
                                            onChange={() => handleRadioChange("budget", option.value)}
                                        />
                                        <span>{option.icon}</span>
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.budget === "Autre" && (
                                <input
                                    type="text"
                                    name="budget"
                                    value={otherValues.budget}
                                    onChange={(e) => handleOtherChange("budget", e.target.value)}
                                    placeholder="Entrez un montant spécifique ici..."
                                    required
                                />
                            )}
                            <button onClick={handleNextStep}>Suivant</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="question">
                            <h2>Question 3 : Quel est votre délai de réalisation ?</h2>
                            <div className="radio-group">
                                {[
                                    { value: "1 semaine", label: "1 semaine", icon: "📅" },
                                    { value: "2 semaines", label: "2 semaines", icon: "📅📅" },
                                    { value: "1 mois", label: "1 mois", icon: "📅📅📅" },
                                    { value: "3 mois", label: "3 mois", icon: "📅📅📅📅" },
                                    { value: "Autre", label: "Autre", icon: "❓" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`radio-card ${
                                            formData.timeline === option.value ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="timeline"
                                            value={option.value}
                                            checked={formData.timeline === option.value}
                                            onChange={() => handleRadioChange("timeline", option.value)}
                                        />

                                        <span>{option.icon}</span>
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.timeline === "Autre" && (
                                <input
                                    type="text"
                                    name="timeline"
                                    value={otherValues.timeline}
                                    onChange={(e) => handleOtherChange("timeline", e.target.value)}
                                    placeholder="Entrez un délai spécifique ici..."
                                    required
                                />
                            )}
                            <button onClick={() => setStep(4)}>Suivant</button>
                        </div>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleSubmit} className="question">

                            <h2>Formulaire de contact</h2>
                            <div>
                                <label htmlFor="name">Nom :</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email :</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message">Message :</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={isLoading}>Envoyer</button>
                            <br/>
                            <br/>
                            {
                                isLoading && <>
                                    Envoi en cours...
                                </>
                            }
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;