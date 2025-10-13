import React, { useState } from 'react';
import { Location } from "@/lib/definitions";
import { useAddLocationMutation } from '@/Features/apiSlice';
import { toast } from "react-toastify";

interface LocationAutocompleteProps {
	name: string;
	placeholder: string;
	value: string;
	options: Location[];
	onChange: any;
	onAdd: any;
	styleMod?:string,
	id?:string
}
function LocationAutocomplete({ name, placeholder, value, options, onChange, onAdd,styleMod,id }: LocationAutocompleteProps) {

	const [inputValue, setInputValue] = useState<string>(value);
	const [suggestions, setSuggestions] = useState<Location[]>([]);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

	const [addLocation, { isLoading: isLocationAdding }] = useAddLocationMutation();
	const [isDisabled, setDisabled] = useState(isLocationAdding);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		const filteredSuggestions = options.filter(
			(option) => option?.locationDetails && option.locationDetails.toLowerCase().indexOf(value.toLowerCase()) > -1
		  );
		setSuggestions(filteredSuggestions);
		setShowSuggestions(true);
	};

	const handleSelectSuggestion = (suggestion: Location) => {
		setInputValue(suggestion?.locationDetails ?? '');
		onChange(suggestion);


		setSuggestions([]);
		setShowSuggestions(false);
	};
 
	const handleAddNew = async () => {
		if (inputValue.trim() && !findObject(options, "locationDetails", inputValue.trim())) {
			console.log("Add new location:", inputValue);
			const newLocation: Location = {
				locationDetails: inputValue.trim()
			};
			setDisabled(true);
			try {
				const response = await addLocation(newLocation).unwrap();
				onAdd(response);
				setDisabled(false);
				setInputValue(inputValue.trim());
			} catch (error:any) {
				setDisabled(false);
				console.log(error);
				toast.error(error.data.message);
			}
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};
	function findObject(arr: Location[], key: keyof Location, value: any): Location | undefined {
		return arr.find(obj => obj[key] === value);
	}

	return (
		<div>
			<input
				className={`w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors ${styleMod}`}
				type="text"
				name={name}
				id={id}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleInputChange}
				disabled={isDisabled}
			/>
			{showSuggestions && (
				<div className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow-lg border w-full dark:bg-gray-700">
					<ul className="py-2 text-base text-gray-700 dark:text-gray-200">
						{suggestions.map((suggestion, index) => (
							<li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" key={index} onClick={() => handleSelectSuggestion(suggestion)}>
								{suggestion.locationDetails}
							</li>
						))}
						{inputValue && !findObject(options, "locationDetails", inputValue) && (
							<li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" key={-1} onClick={handleAddNew}>
								Add <b>"{inputValue}"</b >
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
}

export default LocationAutocomplete;