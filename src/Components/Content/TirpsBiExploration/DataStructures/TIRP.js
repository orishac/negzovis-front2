export default class TIRP {
	constructor(
		size,
		symbols,
		symbolsNames,
		relations,
		supportInstances_0,
		supportInstances_1,
		existClass0,
		existClass1,
		numSupportEntities_0,
		numSupportEntities_1,
		meanHorSup_0,
		meanHorSup_1,
		verticalSupport_0,
		verticalSupport_1,
		meanDuration_0,
		meanDuration_1,
		occurences_0,
		occurences_1,
		mean_of_first_interval_0,
		mean_of_first_interval_1,
		mean_offset_from_first_symbol_0,
		mean_offset_from_first_symbol_1,
		supporting_entities_proerties_0,
		supporting_entities_proerties_1
	) {
		this.size = size;
		this.symbols = symbols;
		this.symbolsNames = symbolsNames;
		this.relations = relations;
		this.build_supporting_instances_0 = supportInstances_0;
		this.build_supporting_instances_1 = supportInstances_1;
		this.existClass0 = existClass0;
		this.existClass1 = existClass1;
		this.numSupportEntities_0 = numSupportEntities_0;
		this.numSupportEntities_1 = numSupportEntities_1;
		this.meanHorSup_0 = meanHorSup_0;
		this.meanHorSup_1 = meanHorSup_1;
		this.verticalSupport_0 = verticalSupport_0;
		this.verticalSupport_1 = verticalSupport_1;
		this.meanDuration_0 = meanDuration_0;
		this.meanDuration_1 = meanDuration_1;
		this.occurences_0 = occurences_0;
		this.occurences_1 = occurences_1;
		this.mean_of_first_interval_0 = mean_of_first_interval_0;
		this.mean_of_first_interval_1 = mean_of_first_interval_1;
		this.mean_offset_from_first_symbol_0 = mean_offset_from_first_symbol_0;
		this.mean_offset_from_first_symbol_1 = mean_offset_from_first_symbol_1;
		this.name = [];
		this.supporting_entities_proerties_0 = supporting_entities_proerties_0;
		this.supporting_entities_proerties_1 = supporting_entities_proerties_1;
	}

	relationsJson = {
		'<': 'before',
		c: 'contains',
		m: 'meet',
		s: 'starts',
		o: 'overlaps',
		f: 'finish-by',
		'=': 'equal',
	};

	getSize = () => this.size;
	getSymbols = () => this.symbols;
	getSymbolsNames = () => this.symbolsNames;
	getRelations = () => this.relations;
	getSupInstances0 = () => this.build_supporting_instances_0;
	getSupInstances1 = () => this.build_supporting_instances_1;
	getExistInClass0 = () => this.existClass0;
	getExistInClass1 = () => this.existClass1;
	getNumSupEnt_0 = () => this.numSupportEntities_0;
	getNumSupEnt_1 = () => this.numSupportEntities_1;
	getMeanHorSup_0 = () => this.meanHorSup_0;
	getMeanHorSup_1 = () => this.meanHorSup_1;
	getVericalSup_0 = () => this.verticalSupport_0;
	getVericalSup_1 = () => this.verticalSupport_1;
	getMeanDur_0 = () => this.meanDuration_0;
	getMeanDur_1 = () => this.meanDuration_1;
	getOccurences_0 = () => this.occurences_0;
	getOccurences_1 = () => this.occurences_1;
	get_mean_of_first_interval_0 = () => this.mean_of_first_interval_0;
	get_mean_of_first_interval_1 = () => this.mean_of_first_interval_1;
	get_mean_offset_from_first_symbol_0 = () => this.mean_offset_from_first_symbol_0;
	get_mean_offset_from_first_symbol_1 = () => this.mean_offset_from_first_symbol_1;
	getName = () => this.name;
	getLastSymbol = () => this.symbols[this.symbols.length - 1];
	getFirstSymbol = () => this.symbols[0];
	getLastName = () => this.name[this.name.length - 1];
	getFirstName = () => this.name[0];
	setName = (symbolNames) => (this.name = symbolNames);
	getReationsNames = () => this.relations.map((relation) => this.relationsJson[relation]);
	get_supporting_entities_properties_0 = () => this.supporting_entities_proerties_0;
	get_supporting_entities_properties_1 = () => this.supporting_entities_proerties_1;

	getSymbolNameBySymbol = (symbol) => this.symbolsNames[this.symbols.indexOf(symbol)];
	toString = () => {
		return (
			'size: ' +
			this.size +
			', symbols: ' +
			this.symbols +
			', relations: ' +
			this.relations +
			', sup ent: ' +
			this.numSupportEntities +
			', mean hor: ' +
			this.meanHorSup +
			', occurences: ' +
			this.occurences
		);
	};

	//  my function to compare 2 arrays - if all elements are equal
	compareArrays = (arr1, arr2) => {
		// compare lengths - can save a lot of time
		if (arr1.length !== arr2.length) return false;

		for (var i = 0, l = arr1.length; i < l; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}

		return true;
	};

	printSymbols = () => {
		let toPrint = '';
		for (var index in this.symbols) {
			toPrint = toPrint + this.symbols[index] + '-';
		}
		return toPrint.slice(0, -1);
	};
	printSymbolsNames = () => {
		let toPrint = '';
		for (var index in this.symbolNames) {
			toPrint = toPrint + this.symbolNames[index] + '-';
		}
		return toPrint.slice(0, -1);
	};

	printRelations = () => {
		let toPrint = '';
		for (var index in this.relations) {
			toPrint = toPrint + this.relations[index] + '.';
		}
		return toPrint.slice(0, -1);
	};

	getVectorInSize = (vectorSize) => {
		let vectorSymbols = [];
		let sumRelationTillNow = 0;
		let indexSymbol = vectorSize;
		for (var index = 0; index < indexSymbol; index++) {
			vectorSymbols.push(this.relations[sumRelationTillNow + indexSymbol - index - 1]);
			sumRelationTillNow += indexSymbol - index;
		}
		return vectorSymbols;
	};
	getSymbolInIndex = (symbolIndex) => {
		if (symbolIndex < 0 || symbolIndex >= this.symbols.length) {
			return null;
		}
		return this.symbols[symbolIndex];
	};
	getIndexOfSymbol = (symbol) => {
		return this.symbols.indexOf(symbol);
	};
	getRelationsOfSymbol = (symbol) => {
		const vectorSize = this.getIndexOfSymbol(symbol);
		return this.getVectorInSize(vectorSize);
	};
}
