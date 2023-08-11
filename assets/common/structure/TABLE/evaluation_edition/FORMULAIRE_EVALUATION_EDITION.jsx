import Style from "./FORMULAIRE_EVALUATION_EDITION.scss?module";
import classNames from "classnames";

import {PwLoading} from "pw-components-jsx-dev";
import {showModal} from "common/functions/modal/modalFunction.js";

import {Accordion as AccordionJsx} from "pw-components-jsx-dev";
import {AccordionObject as Accordion} from "pw-components-jsx-dev";

import {DragAndDropObject as DragAndDrop} from "pw-components-jsx-dev";

import {WireframeEvaluationEditionFormulaireApi} from "wireframe/admin/evaluation_edition/classes/WireframeEvaluationEditionFormulaireApi.js"

import MODAL_QUESTION_RENAME from "common/structure/TABLE/evaluation_edition/modal/MODAL_QUESTION_RENAME.jsx";
import MODAL_QUESTION_REMOVE from "common/structure/TABLE/evaluation_edition/modal/MODAL_QUESTION_REMOVE.jsx";

class FORMULAIRE_EVALUATION_EDITION {
	static accordion;
	static dragndrop;
	static questions;

	static getMethods(){
		return {
    		...Question.getMethods(),
    		...AccordionJsx.getMethods(),

			drawQuestions() {
				return this.drawAccordion(
					FORMULAIRE_EVALUATION_EDITION.accordion
				)
			},

			setQuestions(questions=[]){
				FORMULAIRE_EVALUATION_EDITION.questions = questions;
				var {accordion} = FORMULAIRE_EVALUATION_EDITION;

				accordion.cards = [];
				
				questions.map((question) => {
					accordion.cards.push(
						this.getCard(question)
					);
				});
			},

			refreshAccordion(params={}){
				var {
					accordion:a, 
					questions:q,
				} = FORMULAIRE_EVALUATION_EDITION;

				var {
					index = -1,
					accordion = a,
					questions = q,
				} = params;

				// Refresh accordion
				accordion.key = `key-${Date.now()}`;

				// Reset fields value
				this.$resetRenderIndex();

				this.setQuestions(questions);
				this.initDragNDrop(index);
				this.refresh();
			},

			setupQuestions() {
				if(FORMULAIRE_EVALUATION_EDITION.dragndrop){
					return FORMULAIRE_EVALUATION_EDITION.dragndrop
				}

				var accordion = new Accordion();

				// linking accordion
				accordion.instance = this;
				FORMULAIRE_EVALUATION_EDITION.accordion = accordion;

				accordion.id = "questions_accordion";
				accordion.key = accordion.id;
				accordion.cards = [];

				var dragndrop = new DragAndDrop();

				// linking dragndrop
				dragndrop.instance = this;
				FORMULAIRE_EVALUATION_EDITION.dragndrop = dragndrop;

				dragndrop.parentSelector = `#${accordion.id}`;
				dragndrop.itemsSelector = ".card";

				dragndrop.collapse = (index=0) => {
					$(dragndrop.parentSelector)
						.find(`[data-index="${index}"] .collapse`)
						.collapse('show');
				}

				dragndrop.getCollapsedIndex = () => {
					return $(dragndrop.parentSelector)
						.find('.collapse.show')
						.closest('[data-index]')
						.attr('data-index')
				}

				dragndrop.listeners.onDrop = ({event, srcElt, destElt}) => {
					var {questions} = FORMULAIRE_EVALUATION_EDITION;

					// Refresh accordion
					accordion.key = `key-${Date.now()}`;

					var srcIndex = $(srcElt).attr("data-index");
					var destIndex = $(destElt).attr("data-index");

					var collapseIndex = -1;
					var collapsedIndex = dragndrop.getCollapsedIndex();

					var temp = questions[srcIndex];
					questions[srcIndex] = questions[destIndex];
					questions[destIndex] = temp;

					var order = questions[srcIndex].order;
					questions[srcIndex].order = questions[destIndex].order;
					questions[destIndex].order = order;

					if(srcIndex == collapsedIndex){
						collapseIndex = srcIndex;
					}

					if(destIndex == collapsedIndex){
						collapseIndex = destIndex;
					}

					// Reset fields value
					this.$resetRenderIndex();

					this.setQuestions(questions);
					this.initDragNDrop(collapseIndex);
					this.refresh();

					var data = {
						src_id: questions[srcIndex].id,
						src_order: questions[srcIndex].order,
						dest_id: questions[destIndex].id,
						dest_order: questions[destIndex].order,
					};

					WireframeEvaluationEditionFormulaireApi.reorderEvaluationQuestion({
						data,
					})
				}

				return dragndrop;
			},
		};
	}
}

class Question {
	static ALPHA = [
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
		"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
		"U", "V", "W", "X", "Y", "Z"
	];

	static getMethods(){
		return {
			getCard(question={}){
				return {
					head: {
						text: this.renderTitle(question)
					},
					content: {
						render: () => {
							return this.renderContent(question)
						},
					}
				}
			},
		
			renderTitle(question={}){
				return (
					question.name
				)
			},

			renderContent(question={}){
				var renderQuestion = this.renderContentQCM;

				if(question.type == "CL"){
					renderQuestion = this.renderContentCL;
				}

				var showModalRename = () => {
					var {
						buttonRename,
						modalRenameFields,
					} = this.config;
					
					var modal = showModal(MODAL_QUESTION_RENAME, {
						question,
						buttonRename,
						modalRenameFields,
					});
		
					buttonRename.init({
						modal,
						question,
					});
				}

				var showModalRemove = () => {
					var {
						buttonRemove,
					} = this.config;
					
					var modal = showModal(MODAL_QUESTION_REMOVE, {
						question,
						buttonRemove,
					});
		
					buttonRemove.init({
						modal,
						question,
					});
				}

				return (
					<div class="position-relative">
						<div class="position_right">
							<button class="btn btn-primary ml-2" onClick={showModalRename}>
								Renommer
							</button>
							<button class="btn btn-danger ml-2" onClick={showModalRemove}>
								Supprimer
							</button>
						</div>
						<div>
							{renderQuestion(question)}
						</div>
					</div>
				)
			},
		
			renderContentCL(question={}){
				var {
                    fields,
                    buttons
                } = question;

				var {
					label,
					duration,
					correct_answer,
				} = fields;

				var {
					saveQuestion,
				} = buttons;

				return (
					<div>
						<div class="feedback_ctn">
							{this.renderError(question.error)}
							{this.renderSuccess(question.success)}
						</div>
						<div class="duration_ctn">
							{this.$input(duration, this.set(duration))}
						</div>
						<div>
							<div class="label_ctn">
								{this.$input(label, this.set(label))}
							</div>
							<div class="correct_answer_ctn">
								{this.$input(correct_answer, this.set(correct_answer))}
							</div>
							<div class="d-flex justify-content-center mt-4">
								{this.$button(saveQuestion)}
							</div>
						</div>
						<PwLoading
							config={{
								isVisible: question.loading,
								hasConfig: true,
							}}
						/>
					</div>
				)
			},

			renderContentQCM(question={}){
				var {
                    fields,
                    buttons,
                } = question;

				var {
					label,
					choices,
					duration,
				} = fields;

				var {
					addResponse,
					saveQuestion,
					selectCorrectResponse,
				} = buttons;

				return (
					<div>
						<div class="feedback_ctn">
							{this.renderError(question.error)}
							{this.renderSuccess(question.success)}
						</div>
						<div class="duration_ctn">
							{this.$input(duration, this.set(duration))}
						</div>
						<div>
							<div class="label_ctn">
								{this.$input(label, this.set(label))}
							</div>
							<div class="choices_ctn">
								{this.renderChoicesQCM(choices, question)}
							</div>
							<div class="d-flex child_mb_0">
								<div class="mr-2">
									{this.$button(addResponse)}
								</div>
								<div class="mr-2">
									{this.$button(selectCorrectResponse)}
								</div>
							</div>
							<div>
								{this.renderCorrectResponseError(question)}
							</div>
							<div class="d-flex justify-content-center mt-4">
								{this.$button(saveQuestion)}
							</div>
						</div>
						<PwLoading
							config={{
								isVisible: question.loading,
								hasConfig: true,
							}}
						/>
					</div>
				)
			},

			renderChoicesQCM(choices=[], question){
				var {
					fields,
					buttons,
                    is_selecting,
                } = question;

				var {
					saveQuestion,
				} = buttons;

				var selectClass = () => {
					return is_selecting ? "d-block" : "d-none";
				}

				var removeClass = () => {
					return choices.length > 2 ? "d-block" : "d-none";
				}

				var onSelectChoice = (correct_choice) => () => {
					choices.map((choice) => {
						choice.is_correct = false;
					})
					
					correct_choice.is_correct = true;
					question.is_selecting = false;

					this.refresh();
				}

				var onRemoveChoice = (index_rm) => () => {
					fields.choices = choices.filter((choice, i) => {
						return (i != index_rm);
					})

					saveQuestion.updateRequiredFields();
					
					this.refresh();
				}

				return choices.map((choice, i) => {
					var key = Question.ALPHA[i];

					var tr = () => {
						return choice.is_correct ? "choice_correct" : "";
					}

					return (
						<div key={choice.id} class={classNames("choice_elt", tr())}>
							<div 
								class={classNames("choice_select", selectClass())}
								onClick={onSelectChoice(choice)}
							>
							</div>
							<div 
								class={classNames("choice_rm", removeClass())}
								onClick={onRemoveChoice(i, choice)}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="8" cy="8" r="8" fill="#E40909"/>
									<path d="M10.9478 4L7.87062 7.07722L4.7934 4L4 4.79337L7.07725 7.87058L4 10.9478L4.7934 11.7412L7.87062 8.66399L10.9478 11.7412L11.7412 10.9478L8.66399 7.87058L11.7412 4.79337L10.9478 4Z" fill="white"/>
								</svg>
							</div>
							<div class="choice_dsp">
								<span>{key + ")"}</span>
								{this.$input(choice, this.set(choice))}
							</div>
						</div>
					);
				})
			},

			renderCorrectResponseError(question={}){
				if(question.correct_answer_error){
					return (
						<span class="form_feedback_error invalid-feedback d-block">
							{question.correct_answer_error}
						</span>
					);
				}
				return null;
			},
		}
	}
}

export default FORMULAIRE_EVALUATION_EDITION;
