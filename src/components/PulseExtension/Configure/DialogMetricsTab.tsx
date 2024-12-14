import React, { useState, useEffect } from 'react';
import { MetricCollection, InsightsModel } from 'models';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';


const DragHandleIcon = () => (
  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CustomDroppable: React.FC<DroppableProps> = ({ children, ...props }) => (
  <Droppable {...props}>{children}</Droppable>
);

export const MetricsTab = ({ metricCollection, setMetricCollection }) => {
  const [metrics, setMetrics] = useState(metricCollection.metrics);

  useEffect(() => {
    if (metricCollection.metrics.length){
      setMetrics(metricCollection.getOrderedMetrics());
    }
  }, [metricCollection]);



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, metric: InsightsModel) => {
    console.log(`e.target.checked: ${e.target.checked} for ${metric.name}${metric.nameFilters}`);
    let m = new MetricCollection(metrics);
    m.setMetricOptions(metricCollection.metricOptions);
    m.setMetricOptionShowOrHideSingle(metric.specification_id, e.target.checked);
    setMetricCollection(m);
  };

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`e.target.checked: ${e.target.checked}`);
    let m = new MetricCollection(metrics);
    m.setMetricOptions(metricCollection.metricOptions);
    m.setMetricOptionsShowOrHideAll(e.target.checked);
    setMetricCollection(m);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newMetrics = Array.from(metrics);
    const [reorderedItem] = newMetrics.splice(result.source.index, 1);
    newMetrics.splice(result.destination.index, 0, reorderedItem);

    // Call the function to update metric options with the new order
    updateMetricOptionsOrder(newMetrics);
  };

  const updateMetricOptionsOrder = (newMetrics) => {
    let m = new MetricCollection(newMetrics);
    m.setMetricOptions(metricCollection.metricOptions);
    // Assuming there's a method to update the order in MetricCollection
    m.updateMetricOrder(newMetrics.map(metric => metric.specification_id));
    setMetricCollection(m);
  };

  return (
    <div>
      <span className="text-2xl font-extrabold">Metrics</span>
      {metrics && metrics.length > 0 ? (
        <>
          <div className="flex items-center mb-4">
            <input
              className="form-checkbox h-5 w-5 text-blue-600 mr-2"
              type="checkbox"
              id="showAll"
              onChange={(e) => handleAllCheckboxChange(e)}
              checked={Object.values(metricCollection.metricOptions).every(
                (metric: MetricOptions) => metric.show.toString() === 'true'
              )}
            />
            <label htmlFor="showAll" className="text-gray-700 font-medium">Show All</label>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <CustomDroppable droppableId="metrics">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {metrics
                        .sort((a, b) => {
                          const orderA = metricCollection.metricOptions[a.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
                          const orderB = metricCollection.metricOptions[b.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
                          return Number(orderA) - Number(orderB);
                        })
                  .map((metric: InsightsModel, index) => (
                    <Draggable key={metric.specification_id} draggableId={metric.specification_id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-3 transition-shadow hover:shadow-md"
                        >
                          <div {...provided.dragHandleProps} className="mr-3 cursor-move">
                            <DragHandleIcon />
                          </div>
                          <input
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(e, metric)}
                            id={`metric-${metric.specification_id}`}
                            title={`${metric.name}${metric.nameFilters}`}
                            checked={
                              metricCollection?.metricOptions[
                                metric.specification_id
                              ]?.show.toString() === 'true'
                            }
                            className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                          />
                          <label htmlFor={`metric-${metric.specification_id}`} className="text-gray-700 flex-grow">
                            {metric.name} - {metric.namePeriod}
                            {metric.nameFilters && ` - ${metric.nameFilters}`}
                          </label>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </CustomDroppable>
          </DragDropContext>
        </>
      ) : (
        <div className="text-gray-500 text-center">No metrics loaded.  Login on connection tab.</div>
      )}
    </div>
  );
};

