import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Control, UseFormWatch } from "react-hook-form";

import FieldRenderer from "./FieldRenderer";
import { FormStructure } from "./types";

interface DynamicFormProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  structure: FormStructure;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  control,
  watch,
  structure,
}) => {
  const [fields, setFields] = useState(structure.fields);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedField);
    setFields(reorderedFields);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='fields'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ marginBottom: "8px" }}
                  >
                    <FieldRenderer
                      field={field}
                      control={control}
                      watch={watch}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DynamicForm;
