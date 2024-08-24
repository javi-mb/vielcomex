"use client";
import React, { useState, useEffect } from "react";
import {
  FaShippingFast,
  FaGlobeAmericas,
  FaWeightHanging,
  FaSearch,
  FaExchangeAlt,
  FaGasPump,
  FaFileAlt,
} from "react-icons/fa";
import data from "./data.json";

const ShippingCalculator = () => {
  const [shippingType, setShippingType] = useState("nacional");
  const [intlShippingType, setIntlShippingType] = useState("");
  const [fuelOption, setFuelOption] = useState("");
  const [docType, setDocType] = useState("");
  const [zone, setZone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const nationalZones = Object.entries(data.envios.nacional.zonas).flatMap(
    ([zoneKey, zoneValue]) =>
      zoneValue.split(", ").map((city) => ({ zone: zoneKey, city: city }))
  );

  const internationalCountries = Object.entries(
    data.envios.internacional.zonas
  ).flatMap(([zoneKey, countries]) =>
    countries.map((country) => ({ zone: zoneKey, ...country }))
  );

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredCountries = internationalCountries.filter((country) =>
    normalizeText(country.name).includes(normalizeText(searchTerm))
  );

  const weights =
    shippingType === "nacional"
      ? Object.keys(data.envios.nacional.precios.zona1)
      : docType === "dox"
      ? ["0.5kg", "1kg", "2kg"]
      : ["1kg", "5kg", "10kg", "15kg", "20kg", "25kg"];

  useEffect(() => {
    if (shippingType === "nacional" && zone && weight) {
      const calculatedPrice = data.envios.nacional.precios[zone][weight];
      setPrice(calculatedPrice);
    } else if (
      shippingType === "internacional" &&
      intlShippingType &&
      fuelOption &&
      docType &&
      zone &&
      weight
    ) {
      const calculatedPrice =
        data.envios.internacional.precios[intlShippingType][fuelOption][
          docType
        ][zone][weight];
      setPrice(calculatedPrice);
    } else {
      setPrice(null);
    }
  }, [
    shippingType,
    intlShippingType,
    fuelOption,
    docType,
    zone,
    weight,
    searchTerm,
  ]);

  const resetInternationalOptions = () => {
    setIntlShippingType("");
    setFuelOption("");
    setDocType("");
    setZone("");
    setSelectedCountry("");
    setWeight("");
    setSearchTerm("");
  };

  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    const country = internationalCountries.find(
      (c) => normalizeText(c.name) === normalizeText(selectedName)
    );
    if (country) {
      setSelectedCountry(country.name);
      setZone(country.zone);
      setSearchTerm(country.name);
    } else {
      setSearchTerm(selectedName);
    }
  };

  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 px-8 min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-12">
          Calculadora de Envíos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <FaShippingFast className="text-white text-6xl mb-4" />
            <h3 className="text-2xl text-white font-semibold mb-2">Región</h3>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={shippingType}
              onChange={(e) => {
                setShippingType(e.target.value);
                resetInternationalOptions();
              }}
            >
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          {shippingType === "internacional" && (
            <>
              <div className="flex flex-col items-center">
                <FaExchangeAlt className="text-white text-6xl mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-2">
                  Metodo de envio
                </h3>
                <select
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  value={intlShippingType}
                  onChange={(e) => setIntlShippingType(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  <option value="importacion">Importación</option>
                  <option value="exportacion">Exportación</option>
                </select>
              </div>

              <div className="flex flex-col items-center">
                <FaGasPump className="text-white text-6xl mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-2">
                  Opción de Fuel
                </h3>
                <select
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  value={fuelOption}
                  onChange={(e) => setFuelOption(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  <option value="sin_fuel">Si</option>
                  <option value="con_fuel">No</option>
                </select>
              </div>

              <div className="flex flex-col items-center">
                <FaFileAlt className="text-white text-6xl mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-2">
                  Tipo de Paquete
                </h3>
                <select
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  <option value="dox">Documento</option>
                  <option value="no_dox">No Documento</option>
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col items-center">
            <FaGlobeAmericas className="text-white text-6xl mb-4" />
            <h3 className="text-2xl text-white font-semibold mb-2">Zona</h3>
            {shippingType === "internacional" && (
              <div className="relative w-full mb-2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar país..."
                  className="w-full p-2 pl-10 border rounded bg-gray-700 text-white"
                  value={searchTerm}
                  onChange={handleCountryChange}
                  list="countries"
                />
                <datalist id="countries">
                  {filteredCountries.map(({ name }) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            )}
            {shippingType === "nacional" && (
              <select
                className="w-full p-2 border rounded bg-gray-700 text-white"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              >
                <option value="">Seleccione una zona</option>
                {nationalZones.map(({ zone, city }) => (
                  <option key={`${zone}-${city}`} value={zone}>
                    {city}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col items-center">
            <FaWeightHanging className="text-white text-6xl mb-4" />
            <h3 className="text-2xl text-white font-semibold mb-2">Peso</h3>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            >
              <option value="">Seleccione un peso</option>
              {weights.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {price !== null && price !== undefined && (
          <div className="mt-6 p-4 bg-green-600 rounded max-w-md mx-auto">
            <p className="text-2xl font-semibold text-white">
              Precio del envío: $
              {typeof price === "number" ? price.toFixed(2) : price}
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-12">
          <p className="text-lg text-gray-300 mb-6">
            Nuestra calculadora de envíos le permite estimar rápidamente el
            costo de sus envíos nacionales e internacionales. Seleccione el tipo
            de envío, la zona y el peso de su paquete para obtener una
            cotización instantánea.
          </p>
          <p className="text-lg text-gray-300">
            Recuerde que estos precios son estimados y pueden variar según
            factores específicos de cada envío. Para obtener una cotización
            precisa, por favor contáctenos directamente.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShippingCalculator;
