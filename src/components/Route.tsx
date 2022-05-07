import React, { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Pattern, Point, Prediction } from '../models';
import { CTAParams, getPatterns, getPredictions } from '../shared/ctaService';

export interface RouteProps {
  [key: string]: any;
};

export default function Route(props: RouteProps) {
  const [message, setMessage] = useState('Route Rendered');
  const [rt] = useState('76');
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<Pattern|null>(null);
  const [start, setStart] = useState<Point|null>(null);
  const [end, setEnd] = useState<Point|null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const params: CTAParams = { rt };
    getPatterns({ params }).then((next) => {
      setPatterns(next);
      setMessage(`Found ${next.length} patterns`);
    });
  }, [rt]);

  const handleDirChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const nextPatt = patterns.find(({ patternId }) => patternId === parseInt(value, 10)) ?? null;
    setSelectedPattern(nextPatt);
    setStart(null);
    setEnd(null);
  }, [patterns]);

  const handleStartChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const stops = selectedPattern?.stops ?? [];
    const nextPoint = stops.find(({ stopId }) => stopId === value) ?? null;
    setStart(nextPoint);
    setEnd(null);
  }, [selectedPattern]);

  const handleEndChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const stops = selectedPattern?.stops ?? [];
    const nextPoint = stops.find(({ stopId }) => stopId === value) ?? null;
    setEnd(nextPoint);
  }, [selectedPattern]);

  useEffect(() => {
    if (!(selectedPattern && start && end)) return;
    const stpid = [start.stopId, end.stopId].join(',');
    const params: CTAParams = { stpid };
    getPredictions({ params }).then(setPredictions);
  }, [selectedPattern, start, end]);

  const tableData = useMemo(() => {
    if (!(start && end && selectedPattern && Array.isArray(predictions) && predictions.length)) return [];
    const stopIds = { start: start.stopId, end: end.stopId };
    const startPrds = predictions.filter(({ stopId }) => stopId === stopIds.start);
    const startVehicles = startPrds.map(({ vehicleId }) => vehicleId);
    const endPrds = predictions.filter(({ stopId }) => stopId === stopIds.end)
      .filter(({ vehicleId }) => startVehicles.includes(vehicleId));
    const sRow = startPrds.reduce(
      (p, d) => ({ ...p, [`${rt}:${d.vehicleId}`]: d.time }), { stop: start.stopName });
    const rowObj = Object.keys(sRow).reduce((p, k) => ({ ...p, [k]: null }), { stop: null });
    const eRowObj = { ...rowObj, stop: end.stopName };
    const rows = selectedPattern.getStopsBetween(start.sequence, end.sequence)
      .map(({ stopName }) => stopName).map((stop) => ({ ...rowObj, stop }));
    const eRow = endPrds.filter((d) => Object.keys(eRowObj).includes(`${rt}:${d.vehicleId}`)).reduce(
      (p, d) => ({ ...p, [`${rt}:${d.vehicleId}`]: d.time }), eRowObj);
    return [sRow, ...rows, eRow];
  }, [start, end, selectedPattern, predictions, rt])

  return (
    <main>
      <h1>Route Selector</h1>
      <p>{message}</p>
      <form>
        <div>
          <label htmlFor="dir">Choose Direction</label>
          <select name="dir" onChange={handleDirChange}>
            <option key="dir-zero" value="-2"></option>
            {patterns.map((ptr) => (
              <option key={`${ptr.patternId}`} value={ptr.patternId}>
                {`Route ${rt} (${ptr.direction}: ${ptr.firstStop?.stopName} - ${ptr.lastStop?.stopName})`}
              </option>))}
          </select>
        </div>
        {(!selectedPattern) ? null : <div>
          <label htmlFor="start">Choose Start</label>
          <select name="start" onChange={handleStartChange}>
            <option key="start-zero" value="-2"></option>
            {selectedPattern.stops.map((p) => (
              <option key={`st${p.stopId}`} value={p.stopId}>
                {p.stopName}
              </option>))}
          </select>
        </div>}
        {(!start) ? null : <div>
          <label htmlFor="end">Choose end</label>
          <select name="end" onChange={handleEndChange}>
            <option key="end-zero" value="-2"></option>
            {selectedPattern?.getStopsAfter(start.sequence).map((p) => (
              <option key={`en${p.stopId}`} value={p.stopId}>
                {p.stopName}
              </option>))}
          </select>
        </div>}
      </form>
      {(!(start && end && selectedPattern && tableData?.length)) ? null : <div>
        <table>
          <thead><tr>
            {Object.keys(tableData[0]).map((h, i) => (
              <th key={`th${i}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={`tr${idx}`}>
                {Object.values(row).map((x, i) => (<td key={`td${i}`}>{x}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </main>
  );
}
