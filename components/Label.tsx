import { ChangeEvent, FormEvent, useState } from 'react'
import styles from '../styles/Label.module.css'
import { ethers } from 'ethers'

const Label = () => {

  const [input, setInput] = useState<string>('');
  const [subHeader, setSubHeader] = useState<string>('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isVerified = await verifyContract();
    console.log(isVerified)
  }

  const ERC721_INTERFACE_ID = '0x80ac58cd';
  const ERC1155_INTERFACE_ID = '0xd9b67a26';

  const verifyContract = async () => {
    try {
      const res = await fetch(
        'https://api.etherscan.io/api' +
        '?module=contract' +
        '&action=getabi' +
        `&address=${input}` +
        `&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await res.json();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(input, data.result, provider);
      const is721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
      const is1155 = await contract.supportsInterface(ERC1155_INTERFACE_ID);
      
      if (is721) {
        const name = await contract.name();
        const symbol = await contract.symbol();
        setSubHeader(`${name} (${symbol})`);
      }

      return data.status === '1' ? true : false;
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent<HTMLFormElement>) => submitHandler(e)}
      >
        <input
          type='text'
          className={styles.input}
          placeholder='Contract Address'
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e)}
        />
      </form>
      <div className={styles.label}>
        <h1 className={styles.header}>NFT Nutrition</h1>
        <h2 className={styles.subHeader}>{subHeader}</h2>
      </div>
    </div>
  );
}

export default Label;
